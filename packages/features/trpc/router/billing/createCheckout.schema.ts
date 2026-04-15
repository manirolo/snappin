import { PricingSlug } from "@snappin/features/billing/lib/pricing";
import { PlanInterval } from "@snappin/shared/billing/plan.schema";
import z from "zod";

export const ZCreateCheckout = z.object({
    pricingSlug: z.enum(PricingSlug),
    frequency: z.enum(PlanInterval)
})

export type TCreateCheckout = z.infer<typeof ZCreateCheckout>