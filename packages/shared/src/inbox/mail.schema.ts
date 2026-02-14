import z from "zod"

export type AttachmentResource = {

    fileName?: string | null

    mimeType?: string | null

    attachmentId?: string | null,

    buffer?: Buffer | null
}

export type MailResource = {

    from?: string | null

    to?: string | null

    id?: string | null

    subject?: string | null
    
    snippet?: string | null

    body?: string | null

    attachments?: AttachmentResource[] | null

    attachment?: AttachmentResource | null
}

export const ZMailAttachment = z.custom<AttachmentResource>()

export const ZMail = z.custom<MailResource>()