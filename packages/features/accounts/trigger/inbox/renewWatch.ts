import { env } from "@snappin/env";
import { AppCategory, AppSlug } from "@snappin/shared/apps/app.schema";
import { IntegrationStatus } from "@snappin/shared/integration/status.enum";
import { IntegrationResource, OutlookIntegration } from "@snappin/shared/integration/integration.schema";
import { schedules, logger } from "@trigger.dev/sdk";
import type { AnyEmailProvider } from "@snappin/apps/lib/resolveProvider";

export const renewInboxWatch = schedules.task({
    id: "renew-inbox-watch",
    machine: "medium-1x",
    cron: { pattern: "0 */6 * * *", timezone: "Asia/Calcutta" },

    run: async () => {
        const { connectDB } = await import("@snappin/db/connect");
        const { db } = await import("@snappin/db/index");
        const { resolveProvider } = await import("@snappin/apps/lib/resolveProvider");

        const BATCH_SIZE = 500;
        const MAX_BATCH_LOOPS = 20;
        const STALE_LOCK_MS = 10 * 60 * 1000;

        await connectDB();

        let renewed = 0;
        let skipped = 0;
        let failed = 0;
        let loops = 0;

        logger.info("Renew inbox watch run started", {
            batchSize: BATCH_SIZE,
            maxBatchLoops: MAX_BATCH_LOOPS,
            staleLockMs: STALE_LOCK_MS,
            environment: env.env,
        });

        while (loops < MAX_BATCH_LOOPS) {
            loops++;

            const integrations = await db.integration.find({
                appCategory: AppCategory.EMAIL,
                status: IntegrationStatus.CONNECTED,
            }).limit(BATCH_SIZE);

            logger.debug("Fetched integration batch", {
                loop: loops,
                count: integrations.length,
            });

            if (integrations.length === 0) {
                logger.info("No integrations found for renewal", { loop: loops });
                break;
            }

            for (const integration of integrations) {
                if (!integration._id) {
                    skipped++;
                    logger.warn("Skipping integration without _id", {
                        loop: loops,
                        identifierEmail: integration.identifierEmail ?? null,
                        appSlug: integration.appSlug ?? null,
                    });
                    continue;
                }

                const now = Date.now();
                const filter = {
                    _id: integration._id,
                    $or: [
                        { locked: { $ne: true } },
                        { lockedAt: { $lte: now - STALE_LOCK_MS } },
                    ],
                } as Record<string, unknown>;

                logger.debug("Attempting to acquire integration lock", {
                    loop: loops,
                    integrationId: String(integration._id),
                    appSlug: integration.appSlug ?? null,
                    identifierEmail: integration.identifierEmail ?? null,
                });

                const integrationLocked = (await db.integration.findOneAndUpdate(
                    filter,
                    { $set: { locked: true, lockedAt: now } },
                    { returnDocument: "after" }
                )) as unknown as IntegrationResource | null;

                if (!integrationLocked?._id || !integrationLocked?.appCategory || !integrationLocked?.appSlug) {
                    skipped++;
                    logger.debug("Integration lock not acquired or integration incomplete", {
                        loop: loops,
                        integrationId: String(integration._id),
                        identifierEmail: integration.identifierEmail ?? null,
                    });
                    continue;
                }

                const unlock = () =>
                    db.integration.updateOne(
                        { _id: integrationLocked._id },
                        { $set: { locked: false }, $unset: { lockedAt: 1 } }
                    );

                try {
                    logger.debug("Lock acquired for integration", {
                        loop: loops,
                        integrationId: String(integrationLocked._id),
                        appSlug: integrationLocked.appSlug,
                        identifierEmail: integrationLocked.identifierEmail ?? null,
                    });

                    const emailApp = resolveProvider(
                        integrationLocked.appCategory,
                        integrationLocked.appSlug
                    ) as AnyEmailProvider;

                    const shouldRenew = await emailApp.isWatchExpires({ integration: integrationLocked });

                    logger.debug("Evaluated watch expiry", {
                        loop: loops,
                        integrationId: String(integrationLocked._id),
                        appSlug: integrationLocked.appSlug,
                        shouldRenew,
                    });

                    if (!shouldRenew) {
                        await unlock();
                        skipped++;
                        logger.debug("Skipping renewal because watch is still active", {
                            loop: loops,
                            integrationId: String(integrationLocked._id),
                            appSlug: integrationLocked.appSlug,
                        });
                        continue;
                    }

                    if (!emailApp?.renewWatching) {
                        await unlock();
                        skipped++;
                        logger.warn("Provider does not implement renewWatching", {
                            loop: loops,
                            integrationId: String(integrationLocked._id),
                            appSlug: integrationLocked.appSlug,
                        });
                        continue;
                    }

                    const { accessToken } = await emailApp.getAccessToken({
                        integration: integrationLocked,
                    });

                    logger.debug("Access token resolved for renewal", {
                        loop: loops,
                        integrationId: String(integrationLocked._id),
                        appSlug: integrationLocked.appSlug,
                    });

                    const result = await emailApp.renewWatching({
                        accessToken,
                        subscriptionId:
                            integrationLocked.appSlug === AppSlug.OUTLOOK
                                ? (integrationLocked as OutlookIntegration).metadata?.subscriptionId ?? undefined
                                : undefined,
                    });

                    if (!result) {
                        await unlock();
                        skipped++;
                        logger.warn("Provider returned empty renewal result", {
                            loop: loops,
                            integrationId: String(integrationLocked._id),
                            appSlug: integrationLocked.appSlug,
                        });
                        continue;
                    }

                    await db.integration.updateOne(
                        { _id: integrationLocked._id },
                        {
                            $set: {
                                metadata: result,
                                locked: false,
                                lastActivityAt: Date.now(),
                            },
                            $unset: { lockedAt: 1 },
                        }
                    );

                    renewed++;
                    logger.info("Inbox watch renewed", {
                        loop: loops,
                        integrationId: String(integrationLocked._id),
                        appSlug: integrationLocked.appSlug,
                        identifierEmail: integrationLocked.identifierEmail ?? null,
                    });
                } catch (err) {
                    await unlock();
                    failed++;
                    logger.error("Failed to renew inbox watch", {
                        loop: loops,
                        integrationId: String(integrationLocked._id),
                        appSlug: integrationLocked.appSlug,
                        identifierEmail: integrationLocked.identifierEmail ?? null,
                        error: err instanceof Error ? err.message : String(err),
                    });
                }
            }

            if (integrations.length < BATCH_SIZE) {
                logger.info("Stopping batch loop because final batch is smaller than batch size", {
                    loop: loops,
                    count: integrations.length,
                    batchSize: BATCH_SIZE,
                });
                break;
            }
        }

        logger.info("Renew inbox watch run completed", {
            renewed,
            failed,
            skipped,
            loops,
        });

        return { status: "completed", renewed, failed, skipped, loops };
    },
});