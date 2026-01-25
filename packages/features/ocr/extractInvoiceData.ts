import { processInvoiceDocument } from "./processInvoiceDocument";
import { getEntity } from "./utils/getEntity";

export type InvoiceExtractedData = {
    invoiceNumber: string | null;
    invoiceDate: string | null;
    supplierName: string | null;
    supplierAddress: string | null;
    totalAmount: string | null;
    taxAmount: string | null;
    currency: string | null;
};

export async function extractInvoiceData(buffer: Buffer, mimeType: string): Promise<InvoiceExtractedData> {
    const document = await processInvoiceDocument(buffer, mimeType);

    const entities = document?.entities ?? [];
    console.log(entities)
    return {
        invoiceNumber: getEntity(entities, "invoice_id"),
        invoiceDate: getEntity(entities, "invoice_date"),
        supplierName: getEntity(entities, "supplier_name"),
        supplierAddress: getEntity(entities, "supplier_address"),
        totalAmount: getEntity(entities, "total_amount"),
        taxAmount: getEntity(entities, "total_tax_amount"),
        currency: getEntity(entities, "currency"),
    };
}
