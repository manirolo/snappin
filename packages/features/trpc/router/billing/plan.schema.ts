// plan.schema.ts
import z from "zod";
import { PLAN_SLUG_ORDER } from "@snappin/shared/billing/plan.schema";

export const PLAN_SLUGS = PLAN_SLUG_ORDER;
export const PLAN_INTERVALS = ["monthly", "yearly"] as const;

export const ZCreatePlan = z.object({
  slug:        z.enum(PLAN_SLUGS),
  name:        z.string().min(1),
  lsVariantId: z.number().min(1),
  lsProductId: z.number().min(1),
  amount:      z.number().min(0),
  currency:    z.string().length(3).default("USD"),
  interval:    z.enum(PLAN_INTERVALS).default("monthly"),
  isActive:    z.boolean().default(true),
});

export const ZUpdatePlan = ZCreatePlan.partial().extend({
  planId: z.string().min(1),
});

export type TCreatePlan = z.infer<typeof ZCreatePlan>;
export type TUpdatePlan = z.infer<typeof ZUpdatePlan>;