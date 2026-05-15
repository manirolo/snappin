import { ZScan } from "./scan.schema";
import { schemaTask } from "@trigger.dev/sdk";
import { ScanStatus } from "@snappin/shared/inbox/scan.schema";

export const inboxScan = schemaTask({
    id: "inbox.scan-past",
    schema: ZScan,
    run: async (payload) => {
        const { db } = await import("@snappin/db/index");
        const { connectDB } = await import("@snappin/db/connect");
        const { buildMonthlyChunks } = await import("../../lib/scan.chunkMaker");
        const { enforceOrgScanLimit } = await import("../../lib/scan.cleanup");
        const { inboxScanChunk } = await import("./scan.chunk.task");

        await connectDB();

        const scanRequest = await db.scan.findOne({ _id: payload.scanId }).populate("integration");

        if (!scanRequest?.integration || !scanRequest._id || !scanRequest.integrationId || !scanRequest?.integration?._id) return;

        const scanId = scanRequest._id?.toString();

        if (scanRequest.orgId) {
            await enforceOrgScanLimit(scanRequest.orgId, 10);
        }

        try {
            if (!scanRequest.startDate || !scanRequest.endDate) {
                await db.scan.findOneAndUpdate(
                    { _id: scanId },
                    { status: ScanStatus.FAILED, errorReason: "Start date or end date not provided" }
                );
                return;
            }

            // Build monthly chunks
            const chunks = buildMonthlyChunks({
                scanId,
                integrationId: scanRequest.integration?._id?.toString(),
                startDate: scanRequest.startDate,
                endDate: scanRequest.endDate,
            });

            // Persist all chunks upfront
            await db.scanChunk.insertMany(chunks);

            await db.scan.findOneAndUpdate(
                { _id: scanId },
                {
                    status: ScanStatus.IN_PROGRESS,
                    totalChunks: chunks.length,
                    startedAt: Date.now(),
                }
            );

            // Trigger each chunk as a separate parallel Trigger.dev task
            const savedChunks = await db.scanChunk.find({ scanId });

            await Promise.all(
                savedChunks.map((chunk) =>
                    inboxScanChunk.trigger({ chunkId: chunk._id.toString() })
                )
            );

        } catch (err) {
            await db.scan.findOneAndUpdate(
                { _id: scanId },
                {
                    status: ScanStatus.FAILED,
                    errorReason: err instanceof Error ? err.message : "Unexpected error",
                }
            );
            throw err;
        }
    }
});