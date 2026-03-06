// getInvoiceFilterOptions.ts

import { InvoiceResource } from "@snappin/shared/invoice/invoice.schema";
import { VendorResource } from "@snappin/shared/vendor/vendor.schema"; // adjust import

export type InvoiceFilterOptions = {
    vendorOptions: { value: string; label: string; domain: string | null }[];
    senderOptions: { value: string; label: string }[];
    recipientOptions: { value: string; label: string }[];
    invoiceRecipients: { value: string; label: string }[];
    currencies: { value: string; label: string }[];
};

export function getInvoiceFilterOptions(
    invoices: InvoiceResource[],
    vendors: VendorResource[],  // ← new param
): InvoiceFilterOptions {
    const vendorDomains: Record<string, string> = {};
    const email_senders: Record<string, string> = {};
    const email_recipients: Record<string, string> = {};
    const invoice_recipients: Record<string, string> = {};
    const currencies: Set<string> = new Set();

    for (const invoice of invoices) {
        const vendorId = invoice.invoice?.vendorId;

        // Still collect vendor domains from invoice extraction
        if (vendorId && invoice.extraction?.source?.kind === "integration" && invoice.extraction?.source?.metadata?.from) {
            const from = invoice.extraction.source.metadata.from;
            const match = from.match(/^(.*?)\s*<(.+?)>$/);
            const email = match ? (match[2]?.trim() ?? from.trim()) : from.trim();
            vendorDomains[vendorId.toString()] = email;
        }

        if (invoice.invoice?.currency) {
            currencies.add(invoice.invoice.currency.toUpperCase());
        }

        const recipient = invoice.invoice?.recipient;
        if (recipient?.name) {
            invoice_recipients[recipient.name] = recipient.name;
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
        // ← Built from vendors list, not invoices
        vendorOptions: vendors
            .filter((vendor) => vendor._id != null && vendor.name != null)
            .map((vendor) => ({
                value: vendor._id!.toString(),
                label: vendor.name!,
                domain: vendorDomains[vendor._id!.toString()] ?? null,
            })),
        senderOptions: Object.entries(email_senders).map(([email, name]) => ({
            value: email,
            label: name || email,
        })),
        recipientOptions: Object.entries(email_recipients).map(([email, name]) => ({
            value: email,
            label: name || email,
        })),
        invoiceRecipients: Object.entries(invoice_recipients).map(([email, name]) => ({
            value: email,
            label: name || email,
        })),
        currencies: Array.from(currencies).map((c) => ({
            value: c,
            label: c,
        })),
    };
}