import z from "zod"

export const ZGetInvoiceDocumentUrl = z.object({
    documentId: z.string()
})

export type TGetInvoiceDocumentUrl = z.infer<typeof ZGetInvoiceDocumentUrl>