// import { SourceKind } from "@snappin/shared/apps/app.schema";
import { ZInvoiceExtractRequest } from "./invoice.extractRequest.schema"
import pLimit from "p-limit";
import { schemaTask } from "@trigger.dev/sdk";

export const invoiceExtractRequest = schemaTask({
    id: "invoice.extract.request",
    schema: ZInvoiceExtractRequest,
    run: async (payload) => {
        const { invoiceExtract } = await import("./invoice.extract");
        const { InvoiceExtractionRequestService } = await import("../services/invoiceExtractionRequest.service");
        const { connectDB } = await import("@snappin/db/connect");
        const { documentService } = await import("../services/invoiceDocument.service");

        const limit = pLimit(3)
        await Promise.all(
            payload.attachments.map((attachment) =>
                limit(async () => {

                    const { fileId: tempFileId, fileName } =
                        await documentService.uploadToTemp({ attachment, userId: payload.userId })

                    const invoiceExtractionRequest = new InvoiceExtractionRequestService();

                    await connectDB()

                    const request = await invoiceExtractionRequest.createRequest({
                        userId: payload.userId,
                        orgId: payload.orgId,
                        jobId: payload.jobId,
                        source: payload.source,
                        status: "queued",
                        documentId: tempFileId,
                        fileName,
                        attempts: 0,
                    })

                    await invoiceExtract.trigger({ invoiceExtractionRequestId: request._id.toString() })
                    // Return the created request IDs so triggerAndWait has something useful
                    return { jobId: payload.jobId }
                })
            )
        )

    }
})
