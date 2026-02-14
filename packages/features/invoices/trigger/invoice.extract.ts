import { schemaTask } from "@trigger.dev/sdk"
import { ZInvoiceExtract } from "./invoice.extract.schema"
import pLimit from "p-limit";
import { AnalyzeEngine, ZExtractionStatus, TOCREngine } from "@snappin/shared/invoice/invoice.schema";

export const invoiceExtract = schemaTask({
    id: "invoice-extract",
    machine: "medium-1x",
    schema: ZInvoiceExtract,
    run: async (payload) => {
        const start = Date.now();

        const { logger } = await import("@snappin/lib/logger");
        const { invoiceSave } = await import("./invoice.save");
        const { uploadInvoice } = await import("@snappin/infra/google/storage");
        const { StandardizerService } = await import("../lib/standarizers/standardizer.service");
        const { GeminiInvoiceStandardizer } = await import("../lib/standarizers/gemini.standardizer");
        const { findOrGuessCurrency } = await import("../lib/findCurrencyUsingLLM.gemini");
        const { TextractNormalizer } = await import("../lib/normalizers/normalizer.service");
        const { SnappinError } = await import("@snappin/lib/error/snappin.error");
        const { OCRService } = await import("../ocr.service");
        const { AwsTextractEngine } = await import("../textract.ocr.service");
        const { handleInvoiceExtractionFailure } = await import("../utils/handleInvoiceExtractionFailure");

        const limit = pLimit(3)

        // Reuse heavy dependencies across attachments to reduce per-item overhead.
        const ocrEngine = new AwsTextractEngine();
        const ocrService = new OCRService(ocrEngine, TOCREngine.AWS_TEXTRACT, logger);
        const normalizer = new TextractNormalizer();
        const geminiInvoiceStandardizer = new GeminiInvoiceStandardizer();
        const invoiceStandardizer = new StandardizerService(
            geminiInvoiceStandardizer,
            AnalyzeEngine.GEMINI,
            logger
        );

        const attachments = payload.source.mail?.attachments?.filter(
            (a): a is NonNullable<typeof a> =>
                Boolean(a?.buffer)
        ) ?? [];

        if (attachments.length === 0) {
            logger.info("No attachments with buffer found, skipping extraction");
            return;
        }

        await Promise.all(
            attachments.map((attachment) =>
                limit(async () => {

                    try {
                        // Upload invoice attachment first then process
                        // So if any failures observed we can reprocess it
                        // Default fileName for GCP storage // timeNow_YYYY_MM_DD_supplierName_invoiceNumber 

                        const buffer = attachment.buffer!;

                        // Critical step where we extract invoice document data
                        const ocrOutput = await ocrService.extract({ buffer });
                        if (!ocrOutput || !ocrOutput.raw) {
                            throw new SnappinError("Aws textract/Document AI responded with empty result", "ocr_empty_result");
                        }

                        const { vendor, receiver, invoice, lineItems } = normalizer.normalize(ocrOutput.raw)

                        const { data, analyzeEngine } = await invoiceStandardizer.standardize({ invoice, receiver, vendor, lineItems });

                        let currencyFound: string | null = data.invoice?.currency ?? null
                        if (!currencyFound) {
                            // Fallback model for guessing invoice currency where OCR model failed at
                            // This model given liberty to guess the currency based:
                            // - Vendor country and address
                            // - Customer country and address
                            const { currency } = await findOrGuessCurrency({ invoice, receiver, vendor, lineItems })
                            currencyFound = currency
                        }

                        const unique = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
                        const fileName = `${unique}_${payload.integration.appSlug}`
                        // Upload invoice attachment to Storage provider
                        const uploadResponse = await uploadInvoice({ userId: payload.integration.userId, fileName, buffer: attachment.buffer, contentType: attachment?.mimeType })

                        if (!uploadResponse?.fileId) {
                            throw new SnappinError("Invoice upload failed", "storage_upload_failed")
                        }

                        await invoiceSave.trigger({
                            invoice: {
                                ...data.invoice,
                                currency: currencyFound
                            },
                            vendor: data.vendor,
                            extraction: {
                                ocrEngine: ocrOutput.ocrEngine,
                                analyzeEngine,
                                status: ZExtractionStatus.options[1],
                                raw: JSON.stringify({ invoice, vendor, receiver, lineItems })
                            },
                            source: payload.source,
                            integration: payload.integration,
                            attachmentId: uploadResponse?.fileId
                        });
                    }

                    catch (err) {
                        await handleInvoiceExtractionFailure(err, payload)
                    }
                })
            )
        );

        console.log("extract_latency", { ms: Date.now() - start });
    }
})
