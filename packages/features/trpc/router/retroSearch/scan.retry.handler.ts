import { ScanChunkStatus, ScanStatus } from "@snappin/shared/inbox/scan.schema";
import { TRPCError } from "@trpc/server";

export async function retryScan(scanId: string) {
    const { db } = await import("@snappin/db/index");
    const { inboxScanChunk } = await import("@snappin/features/inbox/trigger/inbox/scan.chunk.task");

    const scan = await db.scan.findById(scanId);

    if (!scan) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Scan not found" });
    }

    if (scan.status !== ScanStatus.PAUSED) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Scan is not paused" });
    }

    // Guard: don't allow retry if still within the rate limit window
    if (scan.rateLimit?.retryAfterAt && Date.now() < scan.rateLimit.retryAfterAt) {
        const secondsLeft = Math.ceil((scan.rateLimit.retryAfterAt - Date.now()) / 1000);
        const minutesLeft = Math.ceil(secondsLeft / 60);
        throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: `Rate limit window not expired. Try again in ${minutesLeft} minute(s)`
        });
    }

    const pausedChunks = await db.scanChunk.find({
        scanId,
        status: ScanChunkStatus.PAUSED,
    });

    if (!pausedChunks.length) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "No paused chunks found" });
    }

    // Reset paused chunks — they resume from their saved pageToken automatically
    await db.scanChunk.updateMany(
        { scanId, status: ScanChunkStatus.PAUSED },
        {
            status: ScanChunkStatus.QUEUED,
            "rateLimit.isThrottled": false,
            "rateLimit.retryAfterAt": null,
        }
    );

    await db.scan.findByIdAndUpdate(scanId, {
        status: ScanStatus.IN_PROGRESS,
        "rateLimit.isThrottled": false,
        "rateLimit.retryAfterAt": null,
    });

    // Only re-trigger paused chunks — completed ones are untouched
    await Promise.all(
        pausedChunks.map((chunk) =>
            inboxScanChunk.trigger({ chunkId: chunk._id.toString() })
        )
    );
}