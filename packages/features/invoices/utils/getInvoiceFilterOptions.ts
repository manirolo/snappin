import { RouterOutputs } from "@snappin/features/trpc/_root";

type Invoice = // your invoice type here — replace with actual RouterOutputs type
    RouterOutputs["invoices"]["getInvoices"]["data"][number];

export type InvoiceFilterOptions = {
    vendorOptions: { value: string; label: string, domain: string | null }[];
    senderOptions: { value: string; label: string }[];
    recipientOptions: { value: string; label: string }[];
};

export function getInvoiceFilterOptions(invoices: Invoice[]): InvoiceFilterOptions {
    const vendors: Record<string, string> = {};
    const vendorDomains: Record<string, string> = {}; // ✅ vendorId → sender email
    const email_senders: Record<string, string> = {};
    const email_recipients: Record<string, string> = {};

    for (const invoice of invoices) {
        const vendorId = invoice.invoice?.vendorId;

        if (vendorId && invoice.vendor?.name) {
            vendors[vendorId.toString()] = invoice.vendor.name;

            if(invoice.extraction?.source?.kind != "integration" || !invoice.extraction?.source?.metadata?.from) continue
            const from = invoice.extraction?.source?.metadata?.from;
            if (from) {
                const match = from.match(/^(.*?)\s*<(.+?)>$/);
                const email = match ? (match[2]?.trim() ?? from.trim()) : from.trim();
                vendorDomains[vendorId?.toString()] = email; // e.g. "billing@spotify.com"
            }
        }

        if (invoice.extraction?.source?.kind !== "integration") continue;

        const from = invoice.extraction?.source?.metadata?.from;
        if (from) {
            const match = from.match(/^(.*?)\s*<(.+?)>$/);
            if (match) {
                const [, name, email] = match;
                if (name && email) email_senders[email.trim()] = name.trim();
            } else {
                email_senders[from.trim()] = from.trim();
            }
        }

        const to = invoice.extraction?.source?.metadata?.to;
        if (to) {
            const match = to.match(/^(.*?)\s*<(.+?)>$/);
            if (match) {
                const [, name, email] = match;
                if (name && email) email_recipients[email.trim()] = name.trim();
            } else {
                email_recipients[to.trim()] = to.trim();
            }
        }
    }

    return {
        // ✅ domain now carries the actual sender email like "billing@spotify.com"
        vendorOptions: Object.entries(vendors).map(([id, name]) => ({
            value: id,
            label: name,
            domain: vendorDomains[id] ?? null,
        })),
        senderOptions: Object.entries(email_senders).map(([email, name]) => ({
            value: email,
            label: name || email,
        })),
        recipientOptions: Object.entries(email_recipients).map(([email, name]) => ({
            value: email,
            label: name || email,
        })),
    };
}