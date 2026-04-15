import { EmailAppSlug } from "@snappin/shared/apps/app.schema";
import { ScanChunkStatus, ScanStatus } from "@snappin/shared/inbox/scan.schema";
import {
    LongThrottleError,
    withRetry,
    getRetryAfter,
    getThrottleReason,
} from "@snappin/lib/ratelimit/retry";

export async function processChunk(chunkId: string): Promise<string[] | undefined> {
    const { db } = await import("@snappin/db/index");
    const { EmailAppsStore } = await import("@snappin/apps/appRegistry");

    const chunk = await db.scanChunk.findById(chunkId).populate("integration");
    if (!chunk?.integration) return;

    const provider = EmailAppsStore[chunk.integration.appSlug as EmailAppSlug];
    const { accessToken } = await provider.getAccessToken({ integration: chunk.integration });

    await db.scanChunk.findByIdAndUpdate(chunkId, { status: ScanChunkStatus.DISCOVERING });

    const allMessageIds: string[] = [];
    let pageToken: string | null = chunk.pageToken ?? null;

    do {
        try {
            const page = await withRetry(
                () => provider.listMessagesSince({
                    accessToken,
                    since: Math.floor(chunk.startDate / 1000),
                    until: Math.floor(chunk.endDate / 1000),
                    pageToken,
                    limit: 500,
                }),
                {
                    onThrottle: async (err) => {
                        // Short throttle — just log it to DB and keep retrying
                        await db.scanChunk.findByIdAndUpdate(chunkId, {
                            "rateLimit.isThrottled": true,
                            "rateLimit.throttledAt": Date.now(),
                            "rateLimit.retryAfter": getRetryAfter(err),
                            "rateLimit.lastThrottleReason": getThrottleReason(err),
                            $inc: { "rateLimit.retryCount": 1 },
                        });
                        await db.scan.findByIdAndUpdate(chunk.scanId, {
                            wasThrottled: true,
                            $inc: { rateLimitHits: 1 },
                        });
                    },
                }
            );

            allMessageIds.push(...page.messageIds);
            pageToken = page.nextPageToken ?? null;

            // Always save pageToken after each successful page for crash recovery
            await db.scanChunk.findByIdAndUpdate(chunkId, {
                pageToken,
                hasMorePages: page.hasMore,
                totalMessages: allMessageIds.length,
                "rateLimit.isThrottled": false,
            });

        } catch (err) {

            if (err instanceof LongThrottleError) {
                const retryAfterAt = Date.now() + err.retryAfterSeconds * 1000;

                // Pause chunk — pageToken is already saved so it resumes exactly here
                await db.scanChunk.findByIdAndUpdate(chunkId, {
                    status: ScanChunkStatus.PAUSED,
                    pageToken,
                    "rateLimit.isThrottled": true,
                    "rateLimit.throttledAt": Date.now(),
                    "rateLimit.retryAfter": err.retryAfterSeconds,
                    "rateLimit.retryAfterAt": retryAfterAt,
                    "rateLimit.lastThrottleReason": err.reason,
                    $inc: { "rateLimit.retryCount": 1 },
                });

                await pauseScanIfAllChunksPaused(chunk.scanId.toString());

                return; // Exit cleanly — Trigger.dev will NOT retry
            }

            throw err;
        }

    } while (pageToken);

    await db.scanChunk.findByIdAndUpdate(chunkId, {
        status: ScanChunkStatus.PROCESSING,
        totalMessages: allMessageIds.length,
    });

    return allMessageIds;
}

async function pauseScanIfAllChunksPaused(scanId: string) {
    const { db } = await import("@snappin/db/index");

    const [total, paused, succeeded, failed] = await Promise.all([
        db.scanChunk.countDocuments({ scanId }),
        db.scanChunk.countDocuments({ scanId, status: ScanChunkStatus.PAUSED }),
        db.scanChunk.countDocuments({ scanId, status: ScanChunkStatus.SUCCESS }),
        db.scanChunk.countDocuments({ scanId, status: ScanChunkStatus.FAILED }),
    ]);

    const allSettled = paused + succeeded + failed === total;
    if (!allSettled || paused === 0) return;

    // Find the latest retryAfterAt across all paused chunks — worst case shown to user
    const latestPausedChunk = await db.scanChunk
        .findOne({ scanId, status: ScanChunkStatus.PAUSED })
        .sort({ "rateLimit.retryAfterAt": -1 })
        .select("rateLimit.retryAfterAt");

    await db.scan.findByIdAndUpdate(scanId, {
        status: ScanStatus.PAUSED,
        "rateLimit.isThrottled": true,
        "rateLimit.retryAfterAt": latestPausedChunk?.rateLimit?.retryAfterAt ?? null,
        $inc: { rateLimitHits: 1 },
        wasThrottled: true,
    });
}