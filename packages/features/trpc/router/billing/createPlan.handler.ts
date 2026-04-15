import { TRPCError } from "@trpc/server";
import { ContextProps } from "../../_trpc";
import { TCreatePlan } from "./plan.schema";

export type CreatePlan = {
  ctx: ContextProps;
  input: TCreatePlan;
};

export async function createPlan({ ctx, input }: CreatePlan) {
  const existing = await ctx.db.plan.findOne({ slug: input.slug, interval: input.interval });
  if (existing) {
    throw new TRPCError({
      code: "CONFLICT",
      message: `Plan '${input.slug}' already exists`,
    });
  }

  return ctx.db.plan.create(input);
}
