import z from "zod";

export const ZExtractInvoice = z.object({
    requestId: z.string()
})

export type TExtractInvoice = z.infer<typeof ZExtractInvoice>

export type TExtractInvoiceResponse = {
    message: string
    vendorName: string
}