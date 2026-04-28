import { schemaTask } from "@trigger.dev/sdk";
import { z } from "zod";
import { ScanChunkStatus, ScanMessageStatus, ScanStatus } from "@snappin/shared/inbox/scan.schema";
import { SourceKind } from "@snappin/shared/apps/app.schema";
import { LongThrottleError } from "@snappin/lib/ratelimit/retry";
import { InvoiceAttachment } from "@snappin/features/invoice/trigger/invoice.extractRequest.schema";
import mongoose from "mongoose";

export const inboxScanChunk = schemaTask({
    id: "inbox.scan-chunk",
    schema: z.object({ chunkId: z.string() }),
    run: async (payload) => {
        const { db } = await import("@snappin/db/index");
        const { connectDB } = await import("@snappin/db/connect");
        const { processChunk } = await import("../../lib/scan.chunkProcessor");
        const { mailService } = await import("../../services/mail.service");
        const { classifyThisMail } = await import("../../../snappinAI/services/classification.service");
        const { documentService } = await import("../../../invoice/services/invoiceDocument.service");
        const { invoiceExtractionRequestService } = await import("../../../invoice/services/invoiceExtractionRequest.service");
        const { invoiceExtractService } = await import("../../../invoice/services/invoiceExtract.service");
        const { invoiceSaveService } = await import("../../../invoice/services/invoiceSave.service");
        const { SnappinError } = await import("@snappin/lib/error/snappin.error");
        const { estimateScanDuration } = await import("../../lib/scan.timeEstimate");
        const { resolveIntegrationSnapshot } = await import("@snappin/features/integration/lib/resolveIntegrationSnapshot");
        const { UsageLimitError, usageService } = await import("@snappin/features/billing/service/usage.service");
        const pLimit = (await import("p-limit")).default;

        await connectDB();

        const chunk = await db.scanChunk.findById(payload.chunkId).populate("integration");
        if (!chunk?.integration) return;

        const chunkId = chunk._id.toString();
        const scanId = chunk.scanId.toString();

        // ✅ Fix #5: resolve integration snapshot once, outside all loops
        const _integration = await resolveIntegrationSnapshot(chunk?.integrationId?.toString()) ?? null;

        try {
            const messageIds = await processChunk(chunkId);

            // processChunk returned undefined = chunk was paused due to long throttle
            if (!messageIds) return;

            const existingMessages = await db.scanMessage.find({
                scanId,
                providerMessageId: { $in: messageIds },
                status: ScanMessageStatus.SUCCESS,
            });

            const alreadyProcessed = new Set(existingMessages.map(m => m.providerMessageId));
            const filteredIds = messageIds.filter(id => !alreadyProcessed.has(id));

            if (!filteredIds.length) {
                await db.scanChunk.findByIdAndUpdate(chunkId, { status: ScanChunkStatus.SUCCESS });
                await updateScanProgress(scanId);
                return;
            }

            const agg = await db.scanChunk.aggregate([
                { $match: { scanId: new mongoose.Types.ObjectId(scanId) } },
                { $group: { _id: null, total: { $sum: "$totalMessages" } } }
            ]);

            const knownTotal = agg[0]?.total ?? filteredIds.length;

            await db.scan.findOneAndUpdate(
                { _id: scanId, estimatedDuration: null },
                { estimatedDuration: estimateScanDuration(knownTotal) }
            );

            await db.scanMessage.insertMany(
                filteredIds.map(providerMessageId => ({
                    scanId: chunk.scanId,
                    chunkId: chunk._id,
                    integrationId: chunk.integrationId,
                    providerMessageId,
                    status: ScanMessageStatus.QUEUED,
                    retryCount: 0,
                })),
                { ordered: false }
            );

            await db.scanChunk.findByIdAndUpdate(chunkId, {
                totalMessages: filteredIds.length,
            });

            // ✅ Fix #6: pass filteredIds instead of messageIds
            const payloads = await mailService.processMails({
                integration: chunk.integration,
                messageIds: filteredIds,
                scanId,
            });

            const limit = pLimit(3);
            let limitReached = false;

            await Promise.all(
                payloads.map((mailPayload) =>
                    limit(async () => {
                        // ✅ Fix #1: skip all remaining mails once limit is reached
                        if (limitReached) return;

                        try {
                            if (mailPayload.source.kind !== SourceKind.INTEGRATION) return;

                            const existingMessage = await db.scanMessage.findOne({
                                integrationId: chunk.integrationId,
                                providerMessageId: mailPayload.source.externalId,
                                status: ScanMessageStatus.SUCCESS,
                            });

                            if (existingMessage) return;

                            try {
                                await usageService.assertWithinLimit(mailPayload.orgId ?? "", "invoices");
                            } catch (err) {
                                if (err instanceof UsageLimitError) {
                                    // ✅ Fix #1: set flag to stop all other concurrent tasks
                                    limitReached = true;
                                    await db.scanMessage.findOneAndUpdate(
                                        { scanId, providerMessageId: mailPayload.source.externalId },
                                        {
                                            status: ScanMessageStatus.FAILED,
                                            errorReason: "invoice_limit_reached",
                                        }
                                    );
                                    await db.scan.findByIdAndUpdate(scanId, {
                                        status: ScanStatus.FAILED,
                                        errorReason: "invoice_limit_reached",
                                        completedAt: Date.now(),
                                    });
                                    return;
                                }
                                throw err;
                            }

                            const { category } = await classifyThisMail({
                                subject: mailPayload.source.metadata?.subject,
                                from: mailPayload.source.metadata?.from,
                                snippet: mailPayload.source.metadata?.snippet,
                                body: mailPayload.source.metadata?.body,
                                attachments: mailPayload.source.metadata?.attachments,
                            });

                            if (category === "OTHER") {
                                await db.scanMessage.findOneAndUpdate(
                                    { scanId, providerMessageId: mailPayload.source.externalId },
                                    { status: ScanMessageStatus.SUCCESS }
                                );
                                return;
                            }


                            const integrationSource = mailPayload.source;

                            await db.scanMessage.findOneAndUpdate(
                                { scanId, providerMessageId: mailPayload.source.externalId },
                                { status: ScanMessageStatus.CLASSIFIED }
                            );

                            // ✅ Fix #3: handle empty attachments — mark as SUCCESS and exit
                            if (!mailPayload.attachments.length) {
                                console.warn(`Invoice classified but no extractable attachments for message: ${integrationSource.externalId}`);
                                await db.scanMessage.findOneAndUpdate(
                                    { scanId, providerMessageId: mailPayload.source.externalId },
                                    { status: ScanMessageStatus.SUCCESS }
                                );
                                await db.scanChunk.findByIdAndUpdate(chunkId, {
                                    $inc: { processedMessages: 1 },
                                });
                                return;
                            }

                            await Promise.all(
                                mailPayload.attachments.map(async (attachment: InvoiceAttachment) => {
                                    const { fileId, fileName } = await documentService.uploadToTemp({
                                        attachment,
                                        userId: mailPayload.userId,
                                    });

                                    // ✅ Fix #5: _integration already resolved above, reuse it
                                    const request = await invoiceExtractionRequestService.createRequest({
                                        userId: mailPayload.userId,
                                        orgId: mailPayload.orgId,
                                        jobId: crypto.randomUUID(),
                                        source: {
                                            kind: SourceKind.INTEGRATION,
                                            externalId: integrationSource.externalId,          // ✅
                                            retroactiveScanId: scanId,
                                            integrationId: chunk?.integrationId?.toString() ?? "null",
                                            isRetroactiveScan: true,
                                            metadata: {
                                                subject: integrationSource.metadata?.subject,   // ✅
                                                from: integrationSource.metadata?.from,         // ✅
                                                to: integrationSource.metadata?.to,             // ✅
                                                senderName: integrationSource.metadata?.senderName,   // ✅
                                                receiverName: integrationSource.metadata?.receiverName, // ✅
                                                snippet: integrationSource.metadata?.snippet,   // ✅
                                                body: integrationSource.metadata?.body,         // ✅
                                            },
                                        },
                                        _integration,
                                        status: "queued",
                                        documentId: fileId,
                                        fileName,
                                        attempts: 0,
                                    });

                                    const extractInvoice = await invoiceExtractService.extract(request._id.toString());

                                    if (!extractInvoice) {
                                        throw new SnappinError("Invoice extraction failed", "ocr_engine_failed");
                                    }

                                    const savedInvoice = await invoiceSaveService.save(extractInvoice);
                                    if (!savedInvoice?._id) {
                                        throw new SnappinError("Invoice save failed", "storage_upload_failed"); // ✅ goes to catch
                                    }

                                    await db.scan.findByIdAndUpdate({ _id: scanId }, {
                                        $push: { invoiceFound: savedInvoice._id.toString() },
                                    });

                                })
                            );

                            // ✅ Fix #2: processedMessages incremented here, after attachments succeed
                            await db.scanChunk.findByIdAndUpdate(chunkId, {
                                $inc: { processedMessages: 1 },
                            });

                            await db.scanMessage.findOneAndUpdate(
                                { scanId, providerMessageId: mailPayload.source.externalId },
                                { status: ScanMessageStatus.SUCCESS }
                            );

                        } catch (err) {
                            if (mailPayload.source.kind === SourceKind.INTEGRATION) {
                                await db.scanMessage.findOneAndUpdate(
                                    {
                                        scanId,
                                        providerMessageId: mailPayload.source.externalId,
                                    },
                                    {
                                        status: ScanMessageStatus.FAILED,
                                        $inc: { retryCount: 1 },
                                        errorReason: err instanceof Error ? err.message : "Unknown error",
                                    }
                                );
                            }

                            // ✅ Fix #2: only failedMessages incremented in catch, never processedMessages
                            await db.scanChunk.findByIdAndUpdate(chunkId, {
                                $inc: { failedMessages: 1 },
                            });
                        }
                    })
                )
            );

            await db.scanChunk.findByIdAndUpdate(chunkId, { status: ScanChunkStatus.SUCCESS });
            await updateScanProgress(scanId);

        } catch (err) {
            if (err instanceof LongThrottleError) return;

            await db.scanChunk.findByIdAndUpdate(chunkId, {
                status: ScanChunkStatus.FAILED,
                errorReason: err instanceof Error ? err.message : "Unexpected error",
            });
            await updateScanProgress(scanId);
            throw err;
        }
    }
});

async function updateScanProgress(scanId: string) {
    const { db } = await import("@snappin/db/index");

    const [total, completed, failed, paused] = await Promise.all([
        db.scanChunk.countDocuments({ scanId }),
        db.scanChunk.countDocuments({ scanId, status: ScanChunkStatus.SUCCESS }),
        db.scanChunk.countDocuments({ scanId, status: ScanChunkStatus.FAILED }),
        db.scanChunk.countDocuments({ scanId, status: ScanChunkStatus.PAUSED }),
    ]);

    const allSettled = completed + failed + paused === total;
    if (!allSettled) return;
    if (paused > 0) return;

    const messageAgg = await db.scanChunk.aggregate([
        { $match: { scanId: new mongoose.Types.ObjectId(scanId) } },
        {
            $group: {
                _id: null,
                totalMessages: { $sum: "$totalMessages" },
                processedMessages: { $sum: "$processedMessages" },
                failedMessages: { $sum: "$failedMessages" },
            },
        },
    ]);

    const msgCounts = messageAgg[0] ?? {
        totalMessages: 0,
        processedMessages: 0,
        failedMessages: 0,
    };

    const now = Date.now();
    const CHUNK_TTL_MS = 12 * 60 * 60 * 1000;
    const MESSAGE_TTL_MS = 15 * 60 * 1000;

    await Promise.all([
        db.scanChunk.updateMany(
            { scanId },
            { $set: { expiresAt: new Date(now + CHUNK_TTL_MS) } }
        ),
        db.scanMessage.updateMany(
            { scanId },
            { $set: { expiresAt: new Date(now + MESSAGE_TTL_MS) } }
        ),
        db.scan.findByIdAndUpdate(scanId, {
            status: failed > 0 ? ScanStatus.FAILED : ScanStatus.SUCCESS,
            completedAt: now,
            completedChunks: completed,
            totalMessages: msgCounts.totalMessages,
            processedMessages: msgCounts.processedMessages,
            failedMessages: msgCounts.failedMessages,
        }),
    ]);
}