import { schemaTask } from "@trigger.dev/sdk";
import { z } from "zod";
import { ScanChunkStatus, ScanStatus } from "@snappin/shared/inbox/scan.schema";
import { SourceKind } from "@snappin/shared/apps/app.schema";
import { LongThrottleError } from "@snappin/lib/ratelimit/retry";

export const inboxScanChunk = schemaTask({
    id: "inbox.scan-chunk",
    schema: z.object({ chunkId: z.string() }),
    run: async (payload) => {
        const { db } = await import("@snappin/db/index");
        const { connectDB } = await import("@snappin/db/connect");
        const { processChunk } = await import("../../../../inbox/lib/scan.chunkProcessor");
        const { mailService } = await import("../../services/mail.service");
        const { classifyThisMail } = await import("../../../../features/accounts/trigger/mail/classification/mail.classification.fn");
        const { documentService } = await import("../../../invoice/services/invoiceDocument.service");
        const { invoiceExtractionRequestService } = await import("../../../invoice/services/invoiceExtractionRequest.service");
        const { invoiceExtractService } = await import("../../../invoice/services/invoiceExtract.service");
        const { invoiceSaveService } = await import("../../../invoice/services/invoiceSave.service");
        const { SnappinError } = await import("@snappin/lib/error/snappin.error");
        const pLimit = (await import("p-limit")).default;

        await connectDB();

        const chunk = await db.scanChunk.findById(payload.chunkId).populate("integration");
        if (!chunk?.integration) return;

        const chunkId = chunk._id.toString();
        const scanId = chunk.scanId.toString();

        try {
            const messageIds = await processChunk(chunkId);

            // processChunk returned undefined = chunk was paused due to long throttle
            // Exit cleanly without marking as failed
            if (!messageIds) return;

            if (!messageIds.length) {
                await db.scanChunk.findByIdAndUpdate(chunkId, { status: ScanChunkStatus.SUCCESS });
                await updateScanProgress(scanId);
                return;
            }

            const payloads = await mailService.processMails({
                integration: chunk.integration,
                messageIds,
                scanId,
            });

            const limit = pLimit(3);

            await Promise.all(
                payloads.map((mailPayload) =>
                    limit(async () => {
                        try {
                            if (mailPayload.source.kind !== SourceKind.INTEGRATION) return;

                            const { category } = await classifyThisMail({
                                subject: mailPayload.source.metadata.subject,
                                from: mailPayload.source.metadata.from,
                                snippet: mailPayload.source.metadata.snippet,
                                body: mailPayload.source.metadata.body,
                                attachments: mailPayload.source.metadata.attachments,
                            });

                            if (category === "OTHER") return;

                            await Promise.all(
                                mailPayload.attachments.map(async (attachment) => {
                                    const { fileId, fileName } = await documentService.uploadToTemp({
                                        attachment,
                                        userId: mailPayload.userId,
                                    });


                                    if (mailPayload.source.kind !== SourceKind.INTEGRATION) return;
                                    const request = await invoiceExtractionRequestService.createRequest({
                                        userId: mailPayload.userId,
                                        orgId: mailPayload.orgId,
                                        jobId: crypto.randomUUID(),
                                        source: {
                                            kind: SourceKind.INTEGRATION,
                                            retroactiveScanId: scanId,
                                            metadata: {
                                                subject: mailPayload.source.metadata.subject,
                                                from: mailPayload.source.metadata.from,
                                                to: mailPayload.source.metadata.to,
                                                senderName: mailPayload.source.metadata.senderName,
                                                receiverName: mailPayload.source.metadata.receiverName,
                                                snippet: mailPayload.source.metadata.snippet,
                                                body: mailPayload.source.metadata.body,
                                            },
                                        },
                                        status: "queued",
                                        documentId: fileId,
                                        fileName,
                                        attempts: 0,
                                    });

                                    const extractInvoice = await invoiceExtractService.extract(request._id.toString());

                                    if (!extractInvoice) {
                                        throw new SnappinError("Invoice extraction failed", "ocr_engine_failed");
                                    }

                                    await invoiceSaveService.save(extractInvoice);
                                })
                            );

                            await db.scanChunk.findByIdAndUpdate(chunkId, {
                                $inc: { processedMessages: 1 },
                            });

                        } catch (err) {
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
            // LongThrottleError is handled inside processChunk — should never reach here
            // but guard just in case it bubbles up from mail processing
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

    // Don't overwrite PAUSED status — pauseScanIfAllChunksPaused handles that
    if (paused > 0) return;

    await db.scan.findByIdAndUpdate(scanId, {
        status: failed > 0 ? ScanStatus.FAILED : ScanStatus.SUCCESS,
        completedAt: Date.now(),
        completedChunks: completed,
    });
}