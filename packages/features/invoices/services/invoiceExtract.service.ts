
import { TOCREngine } from "@snappin/shared/invoiceExtractRequest/invoiceExtractionRequest.schema";
import { TInvoiceSave } from "../trigger/invoice.save.schema";

export class InvoiceExtractService {
    async extract(invoiceExtractionRequestId: string): Promise<TInvoiceSave | undefined> {

        const { connectDB } = await import("@snappin/db/connect");
        const { invoiceExtractionRequestService } = await import("./invoiceExtractionRequest.service");
        const { logger } = await import("@snappin/lib/logger");
        const { storageService } = await import("@snappin/infra/google/storage");
        const { ZExtractionStatus } = await import("@snappin/shared/invoiceExtractRequest/invoiceExtractionRequest.schema");
        const { getUnixSeconds } = await import("@snappin/lib/date/unixSeconds");
        const { textractOcrService } = await import("../ocr/textract.ocr.service");
        const { SnappinError } = await import("@snappin/lib/error/snappin.error");
        const { normalizer } = await import("../lib/normalizers/normalizer.service");
        const { invoiceStandardizer } = await import("../llm/standarizers/gemini/invoice.standardizer");
        const { vendorStandardizer } = await import("../llm/standarizers/gemini/vendor.standardizer.gemini");
        const { findOrGuessCurrency } = await import("../llm/fallback/currency/findCurrencyUsingLLM.gemini");
        const { handleInvoiceExtractionFailure } = await import("../utils/handleInvoiceExtractionFailure");


        connectDB()

        const request = await invoiceExtractionRequestService.getRequest({ extractionRequestId: invoiceExtractionRequestId })

        if (!request?.documentId) {
            logger.info("No attachments with buffer found, skipping extraction");
            throw new SnappinError("No attachment found with request id", "no_attachment_with_request");
        }
        try {
            const buffer = await storageService.download(request.documentId);

            await invoiceExtractionRequestService.updateRequest(invoiceExtractionRequestId, {
                attempts: request.attempts + 1,
                status: ZExtractionStatus.options[1],
                startedAt: getUnixSeconds()
            })


            // Critical step where we extract invoice document data
            const expenseDocuments = await textractOcrService.extract({ buffer });



            if (!expenseDocuments.raw || expenseDocuments.raw?.length === 0) {
                throw new SnappinError("Aws Textract responded with empty result", "ocr_empty_result");
            }

            // Process each invoice sequentially (safer for LLM usage)
            for (const doc of expenseDocuments.raw) {

                const { vendor, receiver, invoice, lineItems } = normalizer.normalize(doc);

                const structuredInvoice = await invoiceStandardizer.standardize({ invoice, receiver, lineItems });

                const structuredVendor = await vendorStandardizer.standardize({ vendor });

                let currencyFound: string | null = structuredInvoice?.data.currency ?? null

                if (!currencyFound) {
                    const currencyResponse = await findOrGuessCurrency({ invoice, receiver, vendor, lineItems })
                    currencyFound = currencyResponse?.currency ?? null
                }
                
                console.log(structuredInvoice)

                return {
                    invoice: {
                        ...structuredInvoice.data,
                        currency: currencyFound
                    },
                    vendor: structuredVendor.data,
                    extraction: {
                        ocrEngine: TOCREngine.AWS_TEXTRACT,
                        analyzeEngine: structuredInvoice.analyzeEngine,
                        status: "success",
                    },
                    invoiceExtractionRequestId: invoiceExtractionRequestId,
                };
            }
        }
        catch (err) {
            await handleInvoiceExtractionFailure(err, request._id.toString())
        }
    }

}

export const invoiceExtractService = new InvoiceExtractService()