import z from "zod";

export const ZMailAttachment = z.object({
  fileName: z.string().nullable().optional(),
  mimeType: z.string().nullable().optional(),
  attachmentId: z.string().nullable().optional(),
  buffer: z
    .union([
      z.instanceof(Buffer),
      z.object({ type: z.literal("Buffer"), data: z.array(z.number()) }),
    ])
    .transform((val) => Buffer.isBuffer(val) ? val : Buffer.from(val.data))
    .nullable()
    .optional(),
});

export const ZMail = z.object({
  from: z.string().nullable().optional(),
  senderName: z.string().nullable().optional(),
  to: z.string().nullable().optional(),
  receiverName: z.string().nullable().optional(),
  id: z.string().nullable().optional(),
  subject: z.string().nullable().optional(),
  snippet: z.string().nullable().optional(),
  body: z.string().nullable().optional(),
  attachments: z.array(ZMailAttachment).nullable().optional(),
});

// Infer types from schema instead of manual type definitions
export type AttachmentResource = z.infer<typeof ZMailAttachment>;
export type MailResource = z.infer<typeof ZMail>;