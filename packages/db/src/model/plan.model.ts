// models/plan.model.ts
import mongoose from "mongoose";
import { PLAN_SLUG_ORDER, PlanResource, PlanInterval } from "@snappin/shared/billing/plan.schema";
import { timestampPlugin } from "../plugin/timestamps.plugin";

const PlanSchema = new mongoose.Schema<PlanResource>({
    slug: { type: String, required: true, enum: [...PLAN_SLUG_ORDER] },
    name: { type: String, required: true },
    lsVariantId: { type: Number, required: true },  // used in createCheckout & updateSubscription
    lsProductId: { type: Number, required: true },  // used for webhook product matching
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    interval: { type: String, default: PlanInterval.MONTHLY, enum: Object.values(PlanInterval) },
    isActive: { type: Boolean, default: true, index: true },
    createdAt: { type: Number },
    updatedAt: { type: Number },
})

PlanSchema.plugin(timestampPlugin)
PlanSchema.set("toJSON", { virtuals: true })
PlanSchema.set("toObject", { virtuals: true })

export const Plan: mongoose.Model<PlanResource> =
    (mongoose.models.Plan as mongoose.Model<PlanResource>) ??
    mongoose.model<PlanResource>("Plan", PlanSchema, "plan")