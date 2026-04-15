import { env } from "@snappin/env";
import { AppCategory, AppSlug } from "@snappin/shared/apps/app.schema";
import { IntegrationStatus } from "@snappin/shared/integration/status.enum";
import { schedules } from "@trigger.dev/sdk";
import type { AnyEmailProvider } from "@snappin/apps/lib/resolveProvider";

export const renewInboxWatch = schedules.task({
    id: "renew-inbox-watch",
    machine: "medium-1x",
    cron:
        env.env === "development"
            ? {
                pattern: "*/10 * * * *",
                timezone: "Asia/Calcutta",
            }
            : {
                pattern: "0 */12 * * *",
                timezone: "Asia/Calcutta",
            },

    run: async () => {
        const { connectDB } = await import("@snappin/db/connect");
        const { db } = await import("@snappin/db/index");
        const { resolveProvider } = await import("@snappin/apps/lib/resolveProvider");

        const RENEW_BEFORE_MS = 24 * 60 * 60 * 1000;
        const MAX_EXPIRED_MS = 7 * 24 * 60 * 60 * 1000;
        const STALE_LOCK_MS = 10 * 60 * 1000;
        const BATCH_SIZE = 500;
        const MAX_BATCH_LOOPS = 20;

        await connectDB();

        let renewed = 0;
        let skipped = 0;
        let failed = 0;
        let loops = 0;

        while (loops < MAX_BATCH_LOOPS) {
            loops++;

            const now = Date.now();

            const integrations = await db.integration
                .find({
                    appCategory: AppCategory.EMAIL,
                    mailMonitored: true,
                    status: IntegrationStatus.CONNECTED,
                    mailWatchExpiresAt: {
                        $gte: now - MAX_EXPIRED_MS,
                        $lte: now + RENEW_BEFORE_MS,
                    },
                    $or: [
                        { locked: { $ne: true } },
                        { lockedAt: { $lte: now - STALE_LOCK_MS } },
                    ],
                })
                .sort({ mailWatchExpiresAt: 1, _id: 1 })
                .limit(BATCH_SIZE);

            if (integrations.length === 0) {
                break;
            }

            for (const integration of integrations) {
                const integrationLocked = await db.integration.findOneAndUpdate(
                    {
                        _id: integration._id,
                        appCategory: AppCategory.EMAIL,
                        mailMonitored: true,
                        status: IntegrationStatus.CONNECTED,
                        mailWatchExpiresAt: {
                            $gte: now - MAX_EXPIRED_MS,
                            $lte: now + RENEW_BEFORE_MS,
                        },
                        $or: [
                            { locked: { $ne: true } },
                            { lockedAt: { $lte: now - STALE_LOCK_MS } },
                        ],
                    },
                    {
                        $set: {
                            locked: true,
                            lockedAt: now,
                        },
                    },
                    { "returnDocument": "after" }
                );

                if (!integrationLocked || !integrationLocked?.appCategory || !integrationLocked?.appSlug) {
                    skipped++;
                    continue;
                }

                try {
                    const emailApp = resolveProvider(
                        integrationLocked.appCategory,
                        integrationLocked.appSlug
                    ) as AnyEmailProvider

                    if (!emailApp?.renewWatching) {
                        await db.integration.updateOne(
                            { _id: integrationLocked._id },
                            {
                                $set: { locked: false },
                                $unset: { lockedAt: 1 },
                            }
                        );
                        skipped++;
                        continue;
                    }

                    const { accessToken } = await emailApp.getAccessToken({
                        integration: integrationLocked,
                    });

                    const result = await emailApp.renewWatching({
                        accessToken,
                        subscriptionId:
                            integrationLocked.appSlug === AppSlug.OUTLOOK
                                ? integrationLocked.metadata?.subscriptionId ?? undefined
                                : undefined,
                    });

                    if (!result) {
                        await db.integration.updateOne(
                            { _id: integrationLocked._id },
                            {
                                $set: { locked: false },
                                $unset: { lockedAt: 1 },
                            }
                        );
                        skipped++;
                        continue;
                    }

                    const nextMetadata = {
                        ...(integrationLocked.metadata ?? {}),
                        ...result,
                    };

                    let nextMailWatchExpiresAt: number | undefined;

                    if (
                        integrationLocked.appSlug === AppSlug.GMAIL &&
                        result.watchExpiresAt != null
                    ) {
                        const gmailExpiry = Number(result.watchExpiresAt);
                        if (!Number.isFinite(gmailExpiry)) {
                            throw new Error(
                                `Invalid Gmail watch expiration for integration ${integrationLocked._id}`
                            );
                        }
                        nextMailWatchExpiresAt = gmailExpiry;
                    }

                    if (
                        integrationLocked.appSlug === AppSlug.OUTLOOK &&
                        result.subscriptionExpiresAt
                    ) {
                        const outlookExpiry = new Date(
                            result.subscriptionExpiresAt
                        ).getTime();

                        if (!Number.isFinite(outlookExpiry)) {
                            throw new Error(
                                `Invalid Outlook subscription expiration for integration ${integrationLocked._id}`
                            );
                        }

                        nextMailWatchExpiresAt = outlookExpiry;
                    }

                    if (!nextMailWatchExpiresAt) {
                        throw new Error(
                            `Missing renewed expiry for integration ${integrationLocked._id}`
                        );
                    }

                    await db.integration.updateOne(
                        { _id: integrationLocked._id },
                        {
                            $set: {
                                metadata: nextMetadata,
                                mailWatchExpiresAt: nextMailWatchExpiresAt,
                                locked: false,
                                lastActivityAt: Date.now(),
                            },
                            $unset: { lockedAt: 1 },
                        }
                    );

                    renewed++;
                } catch (err) {
                    await db.integration.updateOne(
                        { _id: integrationLocked._id },
                        {
                            $set: { locked: false },
                            $unset: { lockedAt: 1 },
                        }
                    );

                    failed++;

                    console.error(
                        `❌ Failed to renew inbox watch for integration ${integrationLocked._id}`,
                        err
                    );
                }
            }

            if (integrations.length < BATCH_SIZE) {
                break;
            }
        }

        return {
            status: "completed",
            renewed,
            failed,
            skipped,
            loops,
        };
    },
});