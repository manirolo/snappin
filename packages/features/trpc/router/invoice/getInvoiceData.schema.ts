import z from "zod"
import { InvoiceResource } from "@snappin/shared/invoice/invoice.schema"

export const ZGetInvoiceData = z.object({
    invoiceId: z.string()
})

export type TGetInvoiceData = {
    invoiceId: string
}

export type GetInvoiceDataResponse = InvoiceResource