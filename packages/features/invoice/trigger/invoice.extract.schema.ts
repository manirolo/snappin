import z from "zod"

export const ZInvoiceExtract = z.object({
    invoiceExtractionRequestId: z.string()
})

export type TInvoiceExtract = z.infer<typeof ZInvoiceExtract>