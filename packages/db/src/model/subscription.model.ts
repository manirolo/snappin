import mongoose from "mongoose"
import { AppSlug } from "@snappin/shared/apps/app.schema"
import { SubscriptionResource, SubscriptionLimits } from "@snappin/shared/billing/subscription.schema"
import { timestampPlugin } from "../plugin/timestamps.plugin"
import { PlanInterval } from "@snappin/shared/billing/plan.schema"

const IntegrationLimitsSchema = new mongoose.Schema(
    {
        [AppSlug.XERO]: { type: Boolean, default: false },
        [AppSlug.GOOGLE_DRIVE]: { type: Boolean, default: false },
    },
    { _id: false }
)

const LimitsSchema = new mongoose.Schema<SubscriptionLimits>(
    {
        invoices: { type: Number, default: 0 },
        emailAccounts: { type: Number, default: 0 },
        mobileScanners: { type: Number, default: 0 },
        integrations: { type: IntegrationLimitsSchema, default: {} },
    },
    { _id: false }
)

const SubscriptionSchema = new mongoose.Schema<SubscriptionResource>(
    {
        clerkUserId: { type: String, required: true },
        clerkOrgId: { type: String, required: true },
        subscriptionId: { type: Number, required: true, unique: true },
        customerId: { type: Number, required: true },
        productId: { type: Number, required: true },
        planId: { type: String, required: true },
        status: { type: String, default: "active" },
        interval: { type: String, default: PlanInterval.MONTHLY, enum: Object.values(PlanInterval) },
        currentPeriodStart: { type: Number },
        currentPeriodEnd: { type: Number },
        limits: { type: LimitsSchema, required: true },
        createdAt: { type: Number },
        updatedAt: { type: Number },
    }
)

SubscriptionSchema.plugin(timestampPlugin)

SubscriptionSchema.set("toJSON", { virtuals: true })
SubscriptionSchema.set("toObject", { virtuals: true })

export const Subscription =
    (mongoose.models.Subscription as mongoose.Model<SubscriptionResource>) ??
    mongoose.model<SubscriptionResource>("Subscription", SubscriptionSchema, "subscription")