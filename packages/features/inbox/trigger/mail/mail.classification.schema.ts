import { ZIntegration } from '@snappin/shared/integration/integration.schema'
import { ZSource } from '@snappin/shared/invoice/invoice.schema'
import z from 'zod'

export const ZMailClassification = z.object({
    integration: ZIntegration,
    source: ZSource
})