import { MessageReplyReason, PROCESSING_REACTIONS, buildExtractionSummary } from '@snappin/shared/apps/messaging/messaging.schema'
import { NormalizedMessageEvent } from "./message.received.schema"
import { db } from '@snappin/db/index'
import { connectDB } from '@snappin/db/connect'
import { whatsappClient } from '@snappin/apps/whatsapp/whatsapp.client'
import { invoiceExtractionRequestService } from "@snappin/features/invoice/services/invoiceExtractionRequest.service"
import { documentService } from "@snappin/features/invoice/services/invoiceDocument.service"
import { invoiceExtractService } from "@snappin/features/invoice/services/invoiceExtract.service"
import { invoiceSaveService } from "@snappin/features/invoice/services/invoiceSave.service"
import { SourceKind } from "@snappin/shared/apps/app.schema"
import { resolveIntegrationSnapshot } from "@snappin/features/integration/lib/resolveIntegrationSnapshot"
import { formatDate } from "@snappin/lib/date/formateDate";

const SUPPORTED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]

export async function processEvent(event: NormalizedMessageEvent) {
    const { messageId, media, type } = event
    const from = event.from.startsWith("+") ? event.from : `+${event.from}`

    await whatsappClient.sendTyping(from, messageId)
    connectDB()

    const integration = await db.integration.findOne({ "config.phone": from })

    if (!integration) {
        await whatsappClient.sendMessage(from, MessageReplyReason.ACCOUNT_NOT_CONNECTED)
        return
    }

    if (type === "text" && !media) {
        await whatsappClient.sendMessage(from, MessageReplyReason.WELCOME)
        return
    }

    if (!media || !SUPPORTED_MIME_TYPES.includes(media.mimeType)) {
        await whatsappClient.sendMessage(from, MessageReplyReason.UNSUPPORTED_DOCUMENT)
        return
    }

    await whatsappClient.reactToMessage(from, messageId, PROCESSING_REACTIONS.RECEIVED)

    const [buffer] = await Promise.all([
        whatsappClient.downloadMedia(media.ref),
        whatsappClient.reactToMessage(from, messageId, PROCESSING_REACTIONS.PROCESSING)
    ])

    try {
        // ✅ Fix 1: use media.filename and media.mimeType — not buffer properties
        const { fileId, fileName } = await documentService.uploadToTemp({
            attachment: {
                kind: "buffer",
                buffer,
                fileName: media.filename ?? `document.${media.mimeType.split("/")[1]}`,
                mimeType: media.mimeType,
            },
            userId: integration.userId,
        })
        const integrationId = integration._id?.toString()
        if (!integrationId) throw new Error("Integration ID missing")

        // ✅ Fix 2: build source directly — no `payload` reference
        const _integration = await resolveIntegrationSnapshot(integrationId)

        const request = await invoiceExtractionRequestService.createRequest({
            userId: integration.userId,
            orgId: integration.orgId,
            jobId: crypto.randomUUID(),
            source: {
                kind: SourceKind.INTEGRATION,
                integrationId: integration._id?.toString(),
            },
            _integration,
            status: "queued",
            documentId: fileId,
            fileName,
            attempts: 0,
        })
        const requestId = request._id?.toString()
        if (!requestId) throw new Error("Request ID missing")
        const extractInvoice = await invoiceExtractService.extract(requestId)

        if (!extractInvoice) {
            throw new Error("Invoice extraction failed")
        }

        await invoiceSaveService.save(extractInvoice)

        // ✅ Fix 3: send extraction summary instead of generic message
        const summary = buildExtractionSummary({
            vendorName: extractInvoice.vendor?.name ?? "Unknown Vendor",
            invoiceNumber: extractInvoice.invoice?.invoiceId ?? "-",
            invoiceDate: formatDate("MMM_DD_YYYY", extractInvoice.invoice?.invoiceDate) ?? "-",
            totalAmount: (extractInvoice.invoice?.totals?.total ?? 0) / 100,
            currency: extractInvoice.invoice?.totals?.currency ?? "USD",
        })

        await Promise.all([
            whatsappClient.reactToMessage(from, messageId, PROCESSING_REACTIONS.DONE),
            whatsappClient.sendRawMessage(from, summary),   // send summary text directly
        ])
    } catch(err) {
        console.error("[processEvent] extraction failed:", err)
        await Promise.all([
            whatsappClient.reactToMessage(from, messageId, PROCESSING_REACTIONS.FAILED),
            whatsappClient.sendMessage(from, MessageReplyReason.EXTRACTION_FAILED)
        ])
    }
}