import { InvoiceResource } from "@snappin/shared/invoice/invoice.schema";

class InvoiceService {
    async createInvoice(data: InvoiceResource) {
        const { invoiceRepository } = await import("../repository/invoice.repository");
        return await invoiceRepository.create(data);
    }
}

export const invoiceService = new InvoiceService();