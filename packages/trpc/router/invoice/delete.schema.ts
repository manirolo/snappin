import z from "zod"

export const ZDeleteInvoice = z.object({
    invoiceId: z.string()
})

export type TDeleteInvoice = {
    invoiceId: string
}