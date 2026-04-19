import { TRPCError } from "@trpc/server"
import { ContextProps } from "../../_trpc"
import { cancelSubscription as cancel } from "@lemonsqueezy/lemonsqueezy.js"
import { getLemonSqueezy } from "../../config/ls"

export type CancelSubscription = {
    ctx: ContextProps
}

export async function cancelSubscription({ ctx }: CancelSubscription) {
    if (!ctx.orgId) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" })
    }
    getLemonSqueezy()

    const orgId = ctx.orgId

    const subscription = await ctx.db.subscription.findOne({ clerkOrgId: orgId, status: "active" })

    if (subscription?.subscriptionId) {
        await cancel(subscription.subscriptionId).catch((err) => {
            console.warn("[subscription] Failed to cancel LS subscription:", err?.message)
        })
    }
}