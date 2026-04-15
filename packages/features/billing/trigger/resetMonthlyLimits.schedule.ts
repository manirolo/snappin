// import { env } from "@snappin/env";
// import { schedules } from "@trigger.dev/sdk";

// export const resetFreeMonthlyUsage = schedules.task({
//     id: "reset-free-monthly-usage",
//     machine: "medium-1x",
//     cron: env.env === "development"
//         ? { pattern: "0 0 * * *", timezone: "Asia/Calcutta" }
//         : { pattern: "0 0 1 * *", timezone: "Asia/Calcutta" },  // 1st of every month at midnight

//     run: async () => {
//         const { connectDB } = await import("@snappin/db/connect");
//         const { db } = await import("@snappin/db/index");

//         await connectDB();

//         // Get all orgIds that have an active paid subscription
//         const paidSubscriptions = await db.subscription.find({ status: "active" }).select("orgId")
//         const paidOrgIds = paidSubscriptions.map(s => s.clerkOrgId).filter(Boolean)

//         // Reset invoiceCount only for free plan orgs (not in paid list)
//         const result = await db.organization.updateMany(
//             {
//                 clerkOrgId: { $nin: paidOrgIds },
//                 "usage.invoices": { $gt: 0 },
//             },
//             { $set: { "usage.invoices": 0 } }
//         )

//         console.log(`[resetFreeMonthlyUsage] Reset invoices for ${result.modifiedCount} free plan orgs`)

//         return {
//             status: "completed",
//             modifiedCount: result.modifiedCount,
//             excludedPaidOrgs: paidOrgIds.length,
//         }
//     },
// });