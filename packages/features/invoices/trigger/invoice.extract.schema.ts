import z from "zod"
import { ZIntegration } from '@snappin/shared/integration/integration.schema'
import { ZSource } from "@snappin/shared/invoice/invoice.schema"

export const ZInvoiceExtract = z.object({
    integration: ZIntegration,
    source: ZSource
})

export type TInvoiceExtract = z.infer<typeof ZInvoiceExtract>