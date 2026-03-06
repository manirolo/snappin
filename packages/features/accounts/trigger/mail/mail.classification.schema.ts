import { ZSource } from '@snappin/shared/invoiceExtractRequest/invoiceExtractionRequest.schema'
import z from 'zod'
import { ZBufferAttachment } from '../../../invoices/trigger/invoice.extractRequest.schema'

export const ZMailClassification = z.object({
    userId: z.string(),
    orgId: z.string().optional().nullable(),

    attachments: z.array(ZBufferAttachment),
    
    source: ZSource
})

export type TMailClassification = z.infer<typeof ZMailClassification>