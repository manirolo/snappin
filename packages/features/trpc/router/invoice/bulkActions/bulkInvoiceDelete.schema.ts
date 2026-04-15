import z from "zod";

export const ZBulkInvoiceDelete = z.object({
    invoiceIds: z.array(z.string())
})

export type TBulkInvoiceDelete = z.infer<typeof ZBulkInvoiceDelete>