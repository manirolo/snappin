import { ZInvoiceDocument } from "@snappin/shared/invoice/invoice.schema";
import { ZAnalyzeEngine, ZExtractionStatus, ZOCREngine } from "@snappin/shared/invoiceExtractRequest/invoiceExtractionRequest.schema";
import { ZVendor } from "@snappin/shared/vendor/vendor.schema";
import z from "zod";

export const ZInvoiceSave = z.object({
    invoice: ZInvoiceDocument.nullable().optional(),
    vendor: ZVendor.optional().nullable(),
    invoiceExtractionRequestId: z.string(),
    extraction: z.object({
        ocrEngine: ZOCREngine,
        analyzeEngine: ZAnalyzeEngine,
        status: ZExtractionStatus
    })
})

export type TInvoiceSave = z.infer<typeof ZInvoiceSave>