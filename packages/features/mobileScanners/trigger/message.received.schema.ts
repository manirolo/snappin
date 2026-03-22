import { AppSlug } from "@snappin/shared/apps/app.schema"
import z from "zod"

export type NormalizedMessageEvent = {
    provider: AppSlug.WHATSAPP
    from: string         
    messageId: string
    type: "text" | "document" | "image" | "audio"
    text?: string
    media?: {
        ref: string       
        mimeType: string
        filename?: string
    }
}

export const ZNormalizedMessageEvent = z.custom<NormalizedMessageEvent>()