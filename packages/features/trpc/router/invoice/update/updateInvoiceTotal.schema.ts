import z from "zod"

export const ZUpdateInvoiceTotal = z.object({
    invoiceId: z.string(),
    total: z.number(),
})

export type TUpdateInvoiceTotal = z.infer<typeof ZUpdateInvoiceTotal>