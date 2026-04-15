import { AppSlug } from "../app.schema"

export enum MessageReplyReason {
    UNSUPPORTED_DOCUMENT  = "unsupported_document",
    EXTRACTION_FAILED     = "extraction_failed",
    ACCOUNT_NOT_CONNECTED = "account_not_connected",
    LIMIT_REACHED         = "limit_reached",
    DOCUMENT_RECEIVED     = "document_received",
    PROCESSING_COMPLETE   = "processing_complete",
    WELCOME               = "welcome",
}

export const REPLY_TEMPLATES: Record<MessageReplyReason, string> = {
    [MessageReplyReason.UNSUPPORTED_DOCUMENT]:  "We only support PDF and image files. Please resend in one of these formats.",
    [MessageReplyReason.EXTRACTION_FAILED]:     "We couldn't extract data from your document. Please ensure it's clear and readable.",
    [MessageReplyReason.ACCOUNT_NOT_CONNECTED]: "Your number isn't connected to Snappin. Visit app.snappin.io to connect.",
    [MessageReplyReason.LIMIT_REACHED]:         "You've reached your plan limit. Please upgrade to continue.",
    [MessageReplyReason.DOCUMENT_RECEIVED]:     "Got your document! Processing now...",
    [MessageReplyReason.PROCESSING_COMPLETE]:   "Your document has been processed and saved successfully.",
    [MessageReplyReason.WELCOME]:               "Welcome! 👋 You're connected to Snappin.\n\nSend a *PDF or image* of any document and we'll extract and save the data for you automatically.",
}

export const PROCESSING_REACTIONS = {
    RECEIVED:   "👀",
    PROCESSING: "⏳",
    DONE:       "✅",
    FAILED:     "❌",
} as const

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

// Summary builder — called after successful extraction
export function buildExtractionSummary(invoice: {
    vendorName?: string
    invoiceNumber?: string
    invoiceDate?: string
    totalAmount?: number
    currency?: string
}): string {
    const lines: string[] = ["*✅ Document Extracted Successfully*\n"]

    if (invoice.vendorName)    lines.push(`Vendor: ${invoice.vendorName}`)
    if (invoice.invoiceNumber) lines.push(`ID: ${invoice.invoiceNumber}`)
    if (invoice.invoiceDate)   lines.push(`Date: ${invoice.invoiceDate}`)
    if (invoice.totalAmount != null) {
        const currency = invoice.currency ?? ""
        lines.push(`Total: ${currency} ${invoice.totalAmount.toFixed(2)}`)
    }

    lines.push("\n_Saved to your Snappin account_ 🗂️")
    return lines.join("\n")
}

// messaging.schema.ts — add this

export const WHATSAPP_ERROR_MESSAGES: Record<number, string> = {
    // Media errors
    131052: "We couldn't receive your file due to a WhatsApp error. Please try sending it again.",
    131053: "The file you sent is too large. Please compress it and try again.",
    
    // Message errors  
    131026: "We couldn't deliver the message to your number. Please make sure WhatsApp is active.",
    131047: "Your message couldn't be delivered. Please try again.",
    
    // Rate limit
    131048: "Too many messages sent. Please wait a moment and try again.",
    130429: "We're experiencing high traffic. Please try again shortly.",
    
    // Template/business errors
    132001: "Message template not found. Please contact Snappin support.",
    132007: "Message template rejected. Please contact Snappin support.",

    // Auth errors
    131000: "Something went wrong on our end. Please try again.",
    131005: "Permission denied. Please contact Snappin support.",
    131008: "Required parameter missing. Please contact Snappin support.",
    131009: "Invalid parameter. Please contact Snappin support.",
    131021: "Invalid recipient. Please make sure your WhatsApp number is correct.",

    // Webhook / incoming errors
    131051: "Unsupported message type received.",
    131057: "Business account in maintenance. Please try again later.",
}

export const DEFAULT_WHATSAPP_ERROR_MESSAGE = "Something went wrong. Please try again or contact support at mani@snappinapp.com"

export function getWhatsAppErrorMessage(code: number): string {
    const msg = WHATSAPP_ERROR_MESSAGES[code]
    return msg ? `*Snappin*\n\n${msg}` : DEFAULT_WHATSAPP_ERROR_MESSAGE
}