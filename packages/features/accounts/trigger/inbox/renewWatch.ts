// import { env } from "@snappin/env";
// import { AppCategory } from "@snappin/shared/apps/app.schema";
// import { IntegrationStatus } from "@snappin/shared/integration/status.enum";
// import { schedules } from "@trigger.dev/sdk";

// export const renewInboxWatch = schedules.task({
//     id: "renew-inbox-watch",
//     machine: "medium-1x",
//     // if development rus every 10 mins, otherwise every 12 hours
//     cron: env.env == "development" ?
//         {
//             // You can change this time as you want but before pushing to repo
//             // you need set as 10 mins 
//             pattern: "*/30 * * * *",
//             timezone: "Asia/Calcutta"
//         } :
//         {
//             pattern: "* */12 * * *",
//             timezone: "Asia/Calcutta"
//         },

//     run: async () => {
//         const { connectDB } = await import("@snappin/db/connect");
//         const { db } = await import("@snappin/db/index");
//         const { EmailAppsStore } = await import("@snappin/apps/appRegistry")

//         const RENEW_BEFORE_MS = 24 * 60 * 60 * 1000;
//         const MAX_EXPIRED_MS = 7 * 24 * 60 * 60 * 1000;
//         const STALE_LOCK_MS = 10 * 60 * 1000;
//         const NOW = Date.now()
//         const BATCH_SIZE = 500

//         await connectDB();

//         const integrations = await db.integration.find({
//             appCategory: AppCategory.EMAIL,
//             mailMonitored: true,
//             status: IntegrationStatus.ACTIVE,
//             mailWatchExpiresAt: {
//                 $gte: NOW - MAX_EXPIRED_MS,     // not too old
//                 $lte: NOW + RENEW_BEFORE_MS,    // expiring soon
//             },
//             $or: [
//                 { locked: { $ne: true } },
//                 { lockedAt: { $lte: NOW - STALE_LOCK_MS } }
//             ]
//         }, { new: true })
//             // Soonest first 
//             .sort({ mailWatchExpiresAt: 1 })
//             .limit(BATCH_SIZE)

//         let renewed = 0;
//         let skipped = 0;
//         let failed = 0;

//         for (const integration of integrations) {

//             // Acquire lock before renewing the watch/subscription
//             const integrationLocked = await db.integration.findOneAndUpdate({
//                 _id: integration._id,
//                 status: IntegrationStatus.ACTIVE,
//                 mailMonitored: true,
//                 $or: [
//                     { locked: { $ne: true } },
//                     { lockedAt: { $lte: NOW - STALE_LOCK_MS } }
//                 ],
//             },
//                 {
//                     $set: {
//                         locked: true,
//                         lockedAt: NOW,
//                     },
//                 },
//                 { new: true }
//             )

//             if (!integrationLocked) {
//                 skipped++;
//                 continue;
//             }

//             try {
//                 const emailApp = EmailAppsStore[integrationLocked.appSlug]

//                 if (!emailApp?.renewWatching) {
//                     throw new Error(`No renewWatch handler for ${integrationLocked.appSlug}`);
//                 }
//                 const { accessToken } = await emailApp.getAccessToken({ integration: integrationLocked })
//                 const result = await emailApp.renewWatching({ accessToken })

//                 await db.integration.findOneAndUpdate({
//                     _id: integrationLocked._id
//                 }, {
//                     $set: {
//                         mailHistoryId: result.historyId,
//                         mailWatchExpiresAt: result.expiresAt,
//                         locked: false,
//                     },
//                     $unset: {
//                         lockedAt: 1,
//                     },
//                 })
//                 renewed++;
//             }
//             catch (err) {
//                 await db.integration.updateOne(
//                     { _id: integrationLocked._id },
//                     {
//                         $set: { locked: false },
//                         $unset: { lockedAt: 1 },
//                     }
//                 );

//                 failed++;

//                 console.error(`❌ Failed to renew inbox watch for integration ${integrationLocked._id}`, err);
//             }
//         }

//         return { status: "completed", renewed, failed, skipped };
//     },
// });
