import { AppSlug } from "../apps/app.schema"
import { PlanSlug, PlanInterval } from "./plan.schema"
import { type Subscription } from "@lemonsqueezy/lemonsqueezy.js"

export interface SubscriptionLimits {
    invoices: number
    emailAccounts: number
    mobileScanners: number
    integrations: {
        [AppSlug.XERO]: boolean
        [AppSlug.GOOGLE_DRIVE]: boolean
    }
}

export interface SubscriptionResource {
    clerkUserId: string
    clerkOrgId: string

    // Subscription fields
    subscriptionId: number
    customerId: number
    productId: number
    planId: PlanSlug
    status: Subscription["data"]["attributes"]["status"]
    currentPeriodStart: number           // unix
    currentPeriodEnd: number
    interval: PlanInterval

    // Plan limits (copied from PRICING_CONFIG at subscribe time)
    limits: SubscriptionLimits | null

    createdAt?: number
    updatedAt?: number
}