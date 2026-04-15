import { CreateBillProps, CreateBillResponse } from "../../appRegistry.interface";
import { xero } from "../xero.client";
import { Invoice, Invoices } from "xero-node";
import {
    mapLineAmountType,
    mapContact,
    mapLineItems,
} from "../utils/xero.mapper";
import {sanitizeFileName} from "@snappin/lib/file/fileName"

export async function createBill({
    accessToken,
    tenantId,
    contactName,
    contactEmail,
    invoiceNumber,
    reference,
    invoiceDate,
    dueDate,
    currency,
    lineAmountType,
    lineItems,
    attachment
}: CreateBillProps): Promise<CreateBillResponse> {

    await xero.initialize();
    xero.setTokenSet({ access_token: accessToken ?? undefined });

    // ── Build bill ────────────────────────────────────────────────────────────
    const bill: Invoice = {
        type: Invoice.TypeEnum.ACCPAY,
        status: Invoice.StatusEnum.DRAFT,
        contact: mapContact(contactName, contactEmail),
        lineItems: mapLineItems(lineItems),
        lineAmountTypes: mapLineAmountType(lineAmountType),

        ...(invoiceNumber ? { invoiceNumber } : {}),
        ...(reference ? { reference } : {}),
        ...(currency ? { currencyCode: currency as never } : {}),
        ...(invoiceDate ? { date: invoiceDate } : {}),
        ...(dueDate ? { dueDate } : {}),
    };

    const response = await xero.accountingApi.createInvoices(
        tenantId,
        { invoices: [bill] } as Invoices,
        false,
        4,
    );

    const created = response.body?.invoices?.[0];

    if (!created?.invoiceID) {
        throw new Error(`Xero bill creation failed: ${JSON.stringify(response.body)}`);
    }


    if (attachment?.buffer && attachment?.fileName) {
        const rawName = attachment.fileName.endsWith(".pdf")
            ? attachment.fileName
            : `${attachment.fileName}.pdf`;

        const fileName = sanitizeFileName(rawName);

        const buf = Buffer.isBuffer(attachment.buffer)
            ? attachment.buffer
            : Buffer.from(attachment.buffer)

        await xero.accountingApi.createInvoiceAttachmentByFileName(
            tenantId,
            created.invoiceID,
            fileName,
            buf,
            true,
            undefined,
            { headers: { "Content-Type": "application/pdf" } },
        );
    }

    return {
        billId: created.invoiceID,
        invoiceNumber: created.invoiceNumber ?? null,
        status: String(created.status ?? "DRAFT"), // ✅ Fix 3 — cast StatusEnum to string
        url: `https://go.xero.com/AccountsPayable/View.aspx?InvoiceID=${created.invoiceID}`,
    };
}