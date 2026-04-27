import { MessageReplyReason, PROCESSING_REACTIONS, buildExtractionSummary } from '@snappin/shared/apps/messaging/messaging.schema'
import { IntegrationStatus } from '@snappin/shared/integration/status.enum'
import { ZNormalizedMessageEvent } from "./message.received.schema"
import { schemaTask } from "@trigger.dev/sdk";
import { SourceKind } from '@snappin/shared/apps/app.schema';

const SUPPORTED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]

export const messageReceived = schemaTask({
    id: "message.received",
    schema: ZNormalizedMessageEvent,
    run: async (payload) => {
        const [
            { db },
            { connectDB },
            { whatsappClient },
            { invoiceExtractionRequestService },
            { documentService },
            { invoiceExtractService },
            { invoiceSaveService },
            { resolveIntegrationSnapshot },
            { formatDate },
            { usageService }
        ] = await Promise.all([
            import('@snappin/db/index'),
            import('@snappin/db/connect'),
            import('@snappin/apps/whatsapp/whatsapp.client'),
            import('@snappin/features/invoice/services/invoiceExtractionRequest.service'),
            import('@snappin/features/invoice/services/invoiceDocument.service'),
            import('@snappin/features/invoice/services/invoiceExtract.service'),
            import('@snappin/features/invoice/services/invoiceSave.service'),
            import('@snappin/features/integration/lib/resolveIntegrationSnapshot'),
            import('@snappin/lib/date/formateDate'),
            import('@snappin/features/billing/service/usage.service')
        ])
        const { messageId, media, type } = payload
        const from = payload.from.startsWith("+") ? payload.from : `+${payload.from}`

        await whatsappClient.sendTyping(from, messageId)
        connectDB()

        const integration = await db.integration.findOne({ status: IntegrationStatus.CONNECTED, "metadata.phone": from })

        if (!integration || !integration.orgId) {
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

        const isAllowedToExtract = await usageService.isWithinLimit(integration?.orgId, "invoices")

        if (!isAllowedToExtract) {
            whatsappClient.sendMessage(from, MessageReplyReason.LIMIT_REACHED);
            console.error("Invoice limit reached for org: ", integration?.orgId)
            return
        }

        await whatsappClient.reactToMessage(from, messageId, PROCESSING_REACTIONS.RECEIVED)

        const [buffer] = await Promise.all([
            whatsappClient.downloadMedia(media.ref),
            whatsappClient.reactToMessage(from, messageId, PROCESSING_REACTIONS.PROCESSING)
        ])

        try {
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
        } catch (err) {
            console.error("[processEvent] extraction failed:", err)
            await Promise.all([
                whatsappClient.reactToMessage(from, messageId, PROCESSING_REACTIONS.FAILED),
                whatsappClient.sendMessage(from, MessageReplyReason.EXTRACTION_FAILED)
            ])
        }
    }
})