import { ZInvoice } from "@snappin/shared/invoice/invoice.schema";
import { ZVendor } from "@snappin/shared/vendor/vendor.schema";
import z from "zod";

export const ZInvoiceSave = z.object({
    invoice: ZInvoice.omit({ 
        userId: true, 
        extractionId: true,
        _id: true,
        vendorId: true,
        vendor: true,
        extraction: true,
        createdAt: true,
        updatedAt: true,
    }).nullable().optional(),
    vendor: ZVendor.nullable().optional(),
    invoiceExtractionRequestId: z.string(),
})
export type TInvoiceSave = z.infer<typeof ZInvoiceSave>