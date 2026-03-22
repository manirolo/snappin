import { db } from "@snappin/db/index";
import { InvoiceResource } from "@snappin/shared/invoice/invoice.schema";

class InvoiceRepository {
    async create(data: InvoiceResource) {
        // connectDB()
        return await db.invoice.create(data)
    }
}

export const invoiceRepository = new InvoiceRepository()