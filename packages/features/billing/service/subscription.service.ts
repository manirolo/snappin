import { getPlanLimits, PlanId } from "@snappin/features/billing/lib/pricing"
import { planRepository } from "../repository/plan.repository"
import { subscriptionRepository } from "../repository/subscription.repository"
import { userRepository } from "../../user/repository/user.repository"
import { SubscriptionResource } from "@snappin/shared/billing/subscription.schema"
import { AppSlug } from "@snappin/shared/apps/app.schema"
import { clerk } from "@snappin/features/trpc/config/clerk"
import { PlanInterval, } from "@snappin/shared/billing/plan.schema"
import { accountService } from "@snappin/features/accounts/services/account.service"
import { mobileScannerService } from "@snappin/features/mobileScanners/services/mobileScanner.service"
import { integrationService } from "@snappin/features/integration/services/integration.service"

type SubscriptionStatus = SubscriptionResource["status"]

export type SubscriptionEventData = {
    id: number
    customerId: number
    productId: number
    userId?: string | null
    metadata?: Record<string, string> | null
    status: SubscriptionStatus
    currentPeriodStart: Date
    currentPeriodEnd: Date
    clerkUserId?: string
    clerkOrgId?: string
}

/**
 * Snapshots limits from PRICING_CONFIG at subscribe/upgrade time.
 * These are stored on the subscription row and never re-read from config,
 * so changing PRICING_CONFIG won't affect existing subscribers.
 */
function resolveSubscriptionLimits(planId: PlanId, frequency: PlanInterval): SubscriptionResource["limits"] {
    const limits = getPlanLimits(planId)
    const integrations = limits.integrations as readonly AppSlug[]

    const invoiceCount = frequency == PlanInterval.YEARLY ? limits.monthlyDocs * 12 : limits.monthlyDocs

    return {
        invoices: invoiceCount,
        emailAccounts: limits.emailAccounts,   // keep -1 as-is, UsageService handles it
        mobileScanners: limits.mobileScanners,
        integrations: {
            [AppSlug.GOOGLE_DRIVE]: integrations.includes(AppSlug.GOOGLE_DRIVE),
            [AppSlug.XERO]: integrations.includes(AppSlug.XERO),
        }
    }
}

export class SubscriptionService {

    async onCreate(data: SubscriptionEventData): Promise<void> {
        const plan = await planRepository.get(data.productId)
        if (!plan) {
            console.warn("[SubscriptionService] Unknown productId:", data.productId)
            return
        }

        const clerkUserId = data.clerkUserId
        const clerkOrgId = data.clerkOrgId
        if (!clerkUserId || !clerkOrgId) {
            console.warn("[SubscriptionService] Missing orgId or clerkUserId in metadata")
            return
        }

        const isUserExistInClerk = await clerk.users.getUser(clerkUserId)
        if (!isUserExistInClerk) {
            console.warn("[SubscriptionService] User not exist in clerk")
            return
        }
        // Snapshot limits at subscribe time — not read again until upgrade
        const limits = resolveSubscriptionLimits(plan.slug as PlanId, plan.interval as PlanInterval)

        const existingSubscription = await subscriptionRepository.get(data.id)

        if (existingSubscription) {
            console.warn("[SubscriptionService] Subscription already exist")
            return
        }
        await subscriptionRepository.create({
            clerkUserId,
            clerkOrgId,

            subscriptionId: data.id,
            customerId: data.customerId,
            productId: data.productId,
            planId: plan.slug as PlanId,
            status: "active",
            interval: plan.interval as PlanInterval,
            currentPeriodStart: new Date(data.currentPeriodStart).getTime() / 1000,
            currentPeriodEnd: new Date(data.currentPeriodEnd).getTime() / 1000,
            limits,
        })

        accountService.resumeMonitoringAllAccountsForPaidPlan(clerkOrgId, limits?.emailAccounts ?? 0);
        mobileScannerService.resumeScannersForPaidPlan(clerkOrgId, limits?.mobileScanners ?? 0)

        console.log(`[SubscriptionService] Created subscription. plan: ${plan.slug}`)
    }

    async onUpdate(data: SubscriptionEventData): Promise<void> {
        const plan = await planRepository.get(data.productId)
        if (!plan) {
            console.warn("[SubscriptionService] Unknown productId on update:", data.productId)
            return
        }

        // Re-snapshot limits only on upgrade/downgrade (plan change)
        const limits = resolveSubscriptionLimits(plan.slug as PlanId, plan.interval as PlanInterval)

        await subscriptionRepository.update(data.id, {
            productId: data.productId,
            planId: plan.slug as PlanId,
            status: data.status,
            currentPeriodStart: new Date(data.currentPeriodStart).getTime() / 1000,
            currentPeriodEnd: new Date(data.currentPeriodEnd).getTime() / 1000,
            limits,
        })

        console.log(`[SubscriptionService] Updated subscription: ${data.id}, plan: ${plan.slug}`)
    }

    async onCancel(data: { id: number; status?: SubscriptionStatus }): Promise<void> {
        const subscription = await subscriptionRepository.update(data.id, {
            status: data.status ?? "cancelled"
        })

        if (subscription && subscription?.clerkOrgId) {
            await accountService.pauseMonitoringAllAccountsForFreePlan(subscription?.clerkOrgId);
            await mobileScannerService.pauseScannersForFreePlan(subscription?.clerkOrgId);
            await integrationService.removePaidIntegrations(subscription?.clerkOrgId);
        }

        console.log(`[SubscriptionService] Cancelled subscription: ${data.id}`)
    }
    /**
     * Called on subscription.active and subscription.renewed from Polar.
     * Resets monthly usage counters on the billing user.
     * Polar handles the billing cycle — we just reset our counters to match.
     */
    async onRenewed(data: { id: number }): Promise<void> {
        const subscription = await subscriptionRepository.get(data.id)
        if (!subscription?.clerkUserId) {
            console.warn("[SubscriptionService] Subscription not found on renewed:", data.id)
            return
        }

        await userRepository.updateRaw(
            subscription.clerkUserId,
            { "usage.invoiceCount": 0 }
        )

        console.log(`[SubscriptionService] Reset monthly usage for: ${subscription.clerkUserId}`)
    }
}

export const subscriptionService = new SubscriptionService()