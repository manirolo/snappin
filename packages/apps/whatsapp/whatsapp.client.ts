import { env } from '@snappin/env'
import { AppSlug } from '@snappin/shared/apps/app.schema'
import {
    MessageReplyReason,
    NormalizedMessageEvent,
    // PROCESSING_REACTIONS,
    REPLY_TEMPLATES
} from '@snappin/shared/apps/messaging/messaging.schema'
import { getWhatsAppErrorMessage } from "@snappin/shared/apps/messaging/messaging.schema"

interface WhatsAppMedia {
    id: string
    mime_type: string
    filename?: string
}

interface WhatsAppMessage {
    from: string
    id: string
    type: "text" | "document" | "image" | "audio"
    text?: { body: string }
    document?: WhatsAppMedia
    image?: WhatsAppMedia
}

interface WhatsAppNotificationPayload {
    entry?: Array<{
        changes?: Array<{
            value?: {
                messages?: WhatsAppMessage[]
            }
        }>
    }>
}

export class WhatsAppClient {
    private baseUrl = `https://graph.facebook.com/v22.0/${env.whatsapp.phoneNumberId}`
    private headers = {
        Authorization: `Bearer ${env.whatsapp.token}`,
        "Content-Type": "application/json"
    }

    async normalizeNotification(payload: WhatsAppNotificationPayload): Promise<NormalizedMessageEvent[]> {
       
        const value = payload.entry?.[0]?.changes?.[0]?.value
        if (value?.statuses?.length) {
            for (const status of value.statuses) {
                if (status.errors?.length) {
                    console.error("[whatsapp] status error:", JSON.stringify(status))

                    for (const error of status.errors) {
                        const message = getWhatsAppErrorMessage(error.code)
                        // notify the user with a friendly message
                        await this.sendRawMessage(status.recipient_id, message).catch(() => { })
                    }
                } else {
                    console.log("[whatsapp] status update:", status.status, status.id)
                }
            }
        }
        const messages = value?.messages ?? []
        return messages.map((msg) => ({
            provider: AppSlug.WHATSAPP,
            from: msg.from,
            messageId: msg.id,
            type: msg.type,
            text: msg.text?.body,
            media: msg.document || msg.image
                ? {
                    ref: (msg.document ?? msg.image)!.id,
                    mimeType: (msg.document ?? msg.image)!.mime_type,
                    filename: msg.document?.filename
                }
                : undefined
        }))
    }

    // ✅ only one sendTyping
    async sendTyping(to: string, messageId: string) {
        const res = await fetch(`${this.baseUrl}/messages`, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify({
                messaging_product: "whatsapp",
                status: "read",
                recipient_type: "individual",
                to,
                message_id: messageId,
                typing_indicator: { type: "text" }
            })
        }).catch((err) => {
            console.error("[sendTyping] fetch failed:", err)
            return null
        })

        if (res && !res.ok) {
            const body = await res.json().catch(() => null)
            console.error("[sendTyping] API error:", res.status, JSON.stringify(body))
        }
    }

    async sendMessage(to: string, reason: MessageReplyReason) {
        const res = await fetch(`${this.baseUrl}/messages`, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify({
                messaging_product: "whatsapp",
                to,
                type: "text",
                text: { body: REPLY_TEMPLATES[reason] }
            })
        }).catch((err) => {
            console.error("[sendMessage] fetch failed:", err)
            return null
        })

        if (res && !res.ok) {
            const body = await res.json().catch(() => null)
            console.error("[sendMessage] API error:", res.status, JSON.stringify(body))
        }
    }

    async sendReply(to: string, reason: MessageReplyReason, replyToMessageId?: string) {
        await fetch(`${this.baseUrl}/messages`, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify({
                messaging_product: "whatsapp",
                to,
                type: "text",
                text: { body: REPLY_TEMPLATES[reason] },
                ...(replyToMessageId && { context: { message_id: replyToMessageId } })
            })
        })
    }

    async reactToMessage(to: string, messageId: string, emoji: string) {
        const res = await fetch(`${this.baseUrl}/messages`, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify({
                messaging_product: "whatsapp",
                to,
                type: "reaction",
                reaction: { message_id: messageId, emoji }
            })
        }).catch((err) => {
            console.error("[reactToMessage] fetch failed:", err)
            return null
        })

        if (res && !res.ok) {
            const body = await res.json().catch(() => null)
            console.error("[reactToMessage] API error:", res.status, JSON.stringify(body))
        }
    }

    async sendRawMessage(to: string, text: string) {
        const res = await fetch(`${this.baseUrl}/messages`, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify({
                messaging_product: "whatsapp",
                to,
                type: "text",
                text: { body: text }
            })
        }).catch((err) => {
            console.error("[sendRawMessage] fetch failed:", err)
            return null
        })

        if (res && !res.ok) {
            const body = await res.json().catch(() => null)
            console.error("[sendRawMessage] API error:", res.status, JSON.stringify(body))
        }
    }

    async downloadMedia(mediaId: string): Promise<Buffer> {
        const res = await fetch(`https://graph.facebook.com/v22.0/${mediaId}`, { headers: this.headers })
        const { url } = await res.json()
        const file = await fetch(url, { headers: this.headers })
        return Buffer.from(await file.arrayBuffer())
    }
}

export const whatsappClient = new WhatsAppClient()