
import { InvoiceResource } from "@snappin/shared/invoice/invoice.schema";

export async function createInvoice(payload: InvoiceResource) {
    const { db } = await import("@snappin/db/index");
    return await db.invoice.create(payload)
}