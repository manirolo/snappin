import { ZSource } from "@snappin/shared/invoiceExtractRequest/invoiceExtractionRequest.schema";
import z from "zod";

export const ZBufferAttachment = z.object({
    kind: z.literal("buffer"),
    buffer: z
        .union([
            z.instanceof(Buffer),
            z.object({ type: z.literal("Buffer"), data: z.array(z.number()) }),
        ])
        .transform((val) => Buffer.isBuffer(val) ? val : Buffer.from(val.data))
        .nullable()
        .optional(),
    mimeType: z.string().optional().nullable(),
    fileName: z.string().optional().nullable(),
})

export const ZFileIdAttachment = z.object({
    kind: z.literal("fileId"),
    fileId: z.string(),
    mimeType: z.string().optional().nullable(),
    fileName: z.string().optional().nullable(),
})

export const ZAttachment = z.discriminatedUnion("kind", [
    ZBufferAttachment,
    ZFileIdAttachment,
])

export const ZInvoiceExtractRequest = z.object({
    userId: z.string(),
    orgId: z.string().optional().nullable(),
    jobId: z.string().optional(),

    attachments: z.array(ZAttachment),

    source: ZSource
})

export type InvoiceAttachment = z.infer<typeof ZAttachment>