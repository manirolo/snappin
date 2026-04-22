import { env } from "@snappin/env";
import { ContextProps } from "../../_trpc";
import { createCheckout as lsCreateCheckout } from "@lemonsqueezy/lemonsqueezy.js";
import { TCreateCheckout } from "./createCheckout.schema";
import { clerk } from "../../config/clerk";
import { TRPCError } from "@trpc/server";
import { subscriptionRepository } from "@snappin/features/billing/repository/subscription.repository";
import { PlanSlug } from "@snappin/shared/billing/plan.schema";
import { getLemonSqueezy } from "../../config/ls";

export type CreateCheckout = {
  ctx: ContextProps;
  input: TCreateCheckout;
};

export async function createCheckout({
  ctx,
  input,
}: CreateCheckout): Promise<{ url: string }> {
  if (!ctx.userId || !ctx.orgId) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Please login before subscribing" });
  }

  try {
    getLemonSqueezy();

    // Fix: block if user already has an active non-basic subscription
    const existingSubscription = await subscriptionRepository.findOne({
      clerkUserId: ctx.userId,
      status: "active",
    });

    if (
      existingSubscription &&
      existingSubscription.planId !== PlanSlug.BASIC &&
      existingSubscription.subscriptionId
    ) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You already have an active subscription. Cancel your current plan, then try again.",
      });
    }

    const user = await clerk.users.getUser(ctx.userId);
    const frequency = input.frequency;

    const plan = await ctx.db.plan
      .findOne({ slug: input.pricingSlug, interval: frequency, isActive: true })
      .lean();

    if (!plan?.lsVariantId) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Plan not configured" });
    }

    const { data, error } = await lsCreateCheckout(
      env.ls.storeId,
      plan.lsVariantId,
      {
        checkoutData: {
          email: user.emailAddresses[0]?.emailAddress,
          name: `${user.firstName} ${user.lastName}`.trim(),
          custom: {
            clerk_user_id: user.id,
            clerk_org_id: ctx.orgId
          },
        },
        checkoutOptions: {
          embed: false,
        },
        productOptions: {
          redirectUrl: `${env.app.frontend_url}/dashboard`,
        },
      }
    );

    if (error || !data?.data.attributes.url) {
      console.log(data)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error?.message ?? "Failed to create checkout",
      });
    }

    return { url: data.data.attributes.url };

  } catch (err) {
    if (err instanceof TRPCError) throw err;
    console.error(err);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: err instanceof Error ? err.message : "Something went wrong",
    });
  }
}