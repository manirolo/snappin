import { TRPCError } from "@trpc/server";
import { ContextProps } from "../../_trpc"
import { getLemonSqueezy } from "../../config/ls";
import { subscriptionRepository } from "@snappin/features/billing/repository/subscription.repository";
import { getSubscription } from "@lemonsqueezy/lemonsqueezy.js";

export type GetCustomerPortalUrl = {
    ctx: ContextProps
}

export async function getCustomerPortalUrl({ ctx }: GetCustomerPortalUrl): Promise<{ url: string }> {
    if (!ctx.userId) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Unauthorized" });
    }

    try {
        getLemonSqueezy();

        const subscription = await subscriptionRepository.findOne({
            clerkUserId: ctx.userId,
            status: "active",
        });

        if (!subscription) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Subscription not found",
            });
        }

        const { data } = await getSubscription(String(subscription?.subscriptionId));

        if (!data) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Subscription not found",
            });
        }

        return { url: data['data']['attributes']['urls']['customer_portal'] }
    }
    catch (err) {
        if (err instanceof TRPCError) throw err;
        console.error(err);
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: err instanceof Error ? err.message : "Something went wrong",
        });
    }
}