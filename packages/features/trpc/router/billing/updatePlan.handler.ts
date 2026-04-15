import { TRPCError } from "@trpc/server";
import { ContextProps } from "../../_trpc";
import { TUpdatePlan } from "./plan.schema";

export type UpdatePlan = {
  ctx: ContextProps;
  input: TUpdatePlan;
};

export async function updatePlan({ ctx, input }: UpdatePlan) {
  const { planId, ...patch } = input;

  const plan = await ctx.db.plan.findById(planId);
  if (!plan) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Plan not found" });
  }

  const nextSlug = patch.slug ?? plan.slug;
  const nextInterval = patch.interval ?? plan.interval;
  if (nextSlug !== plan.slug || nextInterval !== plan.interval) {
    const existing = await ctx.db.plan.findOne({
      slug: nextSlug,
      interval: nextInterval,
      _id: { $ne: planId },
    });
    if (existing) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Plan '${String(nextSlug)}' (${String(nextInterval)}) already exists`,
      });
    }
  }

  return ctx.db.plan.findByIdAndUpdate(planId, patch, { new: true });
}
