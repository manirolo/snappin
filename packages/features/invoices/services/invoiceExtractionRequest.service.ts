import { db } from "@snappin/db/index";
import { InvoiceExtractionRequestResource } from "@snappin/shared/invoiceExtractRequest/invoiceExtractionRequest.schema";

export class InvoiceExtractionRequestService {
    async createRequest(props: InvoiceExtractionRequestResource) {
        return await db.invoiceExtractionRequest.create(props)
    }

    async getRequest({ extractionRequestId }: { extractionRequestId: string }) {
        return await db.invoiceExtractionRequest.findOne({ _id: extractionRequestId })
    }

    async updateRequest(extractionRequestId: string, data: Partial<InvoiceExtractionRequestResource>) {
        return await db.invoiceExtractionRequest.findOneAndUpdate({ _id: extractionRequestId }, data)
    }
}


export const invoiceExtractionRequestService = new InvoiceExtractionRequestService();