import { ZIntegration } from "@snappin/shared/integration/integration.schema";
import { ZExtraction, ZInvoiceDocument, ZSource } from "@snappin/shared/invoice/invoice.schema";
import { ZVendor } from "@snappin/shared/invoice/vendor.schema";
import z from "zod";

export const ZInvoiceSave = z.object({
    invoice: ZInvoiceDocument.nullable().optional(),
    vendor: ZVendor.nullable(),
    extraction: ZExtraction.nullable().optional(),
    integration: ZIntegration,
    source: ZSource,
    attachmentId: z.string().optional()
})