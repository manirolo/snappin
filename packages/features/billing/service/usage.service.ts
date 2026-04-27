import { connectDB } from "@snappin/db/connect"
import { db } from "@snappin/db/index"
import { AppRole, AppSlug } from "@snappin/shared/apps/app.schema"
import { SubscriptionLimits, SubscriptionResource } from "@snappin/shared/billing/subscription.schema"
import { IntegrationStatus } from "@snappin/shared/integration/status.enum"

export type CountUsageKey = "invoices" | "emailAccounts" | "mobileScanners"

const COUNT_KEY_LABELS: Record<CountUsageKey, string> = {
    invoices: "invoice extractions",
    emailAccounts: "email accounts",
    mobileScanners: "mobile scanners"
}

const INTEGRATION_KEY_LABELS: Partial<Record<string, string>> = {
    [AppSlug.XERO]: "Xero",
    [AppSlug.GOOGLE_DRIVE]: "Google Drive",
}

// Basic free plan limits — applied when no active subscription exists
export const BASIC_LIMITS: SubscriptionLimits = {
    invoices: 10,
    emailAccounts: 1,
    mobileScanners: 1,
    integrations: {
        [AppSlug.XERO]: false,
        [AppSlug.GOOGLE_DRIVE]: true,
    },
}

export type IntegrationUsageKey = keyof SubscriptionLimits["integrations"]

// ── Error ────────────────────────────────────────────────────────────────────

export class UsageLimitError extends Error {
    public readonly displayMessage: string

    constructor(
        public readonly reason: "no_valid_org" | "no_plan" | "plan_limit_reached",
        public readonly key: CountUsageKey | `integration:${string}` | "emailAccounts" | "mobileScanners",
    ) {
        super(`${reason}:${key}`)
        this.name = "UsageLimitError"

        const labelMap: Record<string, string> = {
            ...COUNT_KEY_LABELS,
        }

        const isIntegration = key.startsWith("integration:")
        const slug = isIntegration ? key.replace("integration:", "") : null
        const label = slug
            ? INTEGRATION_KEY_LABELS[slug] ?? slug
            : labelMap[key] ?? key

        this.displayMessage = reason === "no_plan"
            ? `You don't have an active plan. Sign up to continue.`
            : reason == "plan_limit_reached" ? `You've reached your plan limit for ${label}. Upgrade your plan to continue.` : "No valid session found"
    }
}

// ── Service ──────────────────────────────────────────────────────────────────
connectDB()

export class UsageService {
    private readonly db = db

    private async getActiveSubscription(orgId: string) {
        return this.db.subscription.findOne({ clerkOrgId: orgId, status: "active" })
    }

    private getStoredLimits(subscription: SubscriptionResource | null): SubscriptionLimits {
        if (!subscription) return BASIC_LIMITS
        return subscription.limits as SubscriptionLimits
    }

    private async getOrgUsage(orgId: string): Promise<Record<string, number>> {
        const org = await this.db.organization.findOne({ clerkOrgId: orgId })
        return (org as unknown as { usage?: Record<string, number> })?.usage ?? {}
    }

    // ── Invoice Count ────────────────────────────────────────────────────────
    async assertWithinLimit(orgId: string, key: CountUsageKey): Promise<void> {
        const [subscription, usage] = await Promise.all([
            this.getActiveSubscription(orgId),
            this.getOrgUsage(orgId),
        ])

        const limits = this.getStoredLimits(subscription)
        const current = usage[key] ?? 0
        const limit = limits[key] as number

        if (limit !== -1 && current >= limit) {
            throw new UsageLimitError("plan_limit_reached", key)
        }
    }

    async isWithinLimit(orgId: string, key: CountUsageKey): Promise<boolean> {
        const [subscription, usage] = await Promise.all([
            this.getActiveSubscription(orgId),
            this.getOrgUsage(orgId),
        ])

        const limits = this.getStoredLimits(subscription)
        const current = usage[key] ?? 0
        const limit = limits[key] as number

        if (limit !== -1 && current >= limit) {
            return false
        }
        return true
    }

    async increment(orgId: string, key: CountUsageKey): Promise<void> {
        await this.db.organization.findOneAndUpdate(
            { clerkOrgId: orgId },
            { $inc: { [`usage.${key}`]: 1 } }
        )
    }

    async incrementBy(orgId: string, key: CountUsageKey, amount: number): Promise<void> {
        await this.db.organization.findOneAndUpdate(
            { clerkOrgId: orgId },
            { $inc: { [`usage.${key}`]: amount } }
        )
    }

    async decrement(orgId: string, key: CountUsageKey): Promise<void> {
        await this.db.organization.findOneAndUpdate(
            { clerkOrgId: orgId, [`usage.${key}`]: { $gt: 0 } },
            { $inc: { [`usage.${key}`]: -1 } }
        )
    }

    async resetMonthlyUsage(orgId: string): Promise<void> {
        await this.db.organization.findOneAndUpdate(
            { clerkOrgId: orgId },
            { $set: { "usage.invoices": 0 } }
        )
    }

    // ── Account Limits ───────────────────────────────────────────────────────

    async assertEmailAccountAllowed(orgId?: string | null): Promise<void> {
        if (!orgId) throw new Error("No valid session found")
        const subscription = await this.getActiveSubscription(orgId)
        const limits = this.getStoredLimits(subscription)

        if (limits.emailAccounts === -1) return

        const currentCount = await this.db.integration.countDocuments({
            orgId,
            appRoles: [AppRole.EMAIL_SOURCE],
            status: IntegrationStatus.CONNECTED
        })

        if (currentCount >= limits.emailAccounts) {
            throw new UsageLimitError("plan_limit_reached", "emailAccounts")
        }
    }

    async assertWhatsappAccountAllowed(orgId: string): Promise<void> {
        const subscription = await this.getActiveSubscription(orgId)
        const limits = this.getStoredLimits(subscription)

        if (limits.mobileScanners === -1) return

        const currentCount = await this.db.integration.countDocuments({
            orgId,
            appRoles: "whatsapp_source",
        })

        if (currentCount >= limits.mobileScanners) {
            throw new UsageLimitError("plan_limit_reached", "mobileScanners")
        }
    }

    // ── Integration-based Usage ──────────────────────────────────────────────

    async assertIntegrationAllowed(orgId: string, appSlug: AppSlug): Promise<void> {
        const subscription = await this.getActiveSubscription(orgId)
        const limits = this.getStoredLimits(subscription)
        const allowed = limits.integrations[appSlug as keyof typeof limits.integrations] ?? false

        if (!allowed) {
            throw new UsageLimitError("plan_limit_reached", `integration:${appSlug}`)
        }
    }

    async setIntegrationUsage(orgId: string, appSlug: IntegrationUsageKey, value: boolean): Promise<void> {
        await this.db.organization.findOneAndUpdate(
            { clerkOrgId: orgId },
            { $set: { [`usage.integrations.${appSlug}`]: value } }
        )
    }

    // ── Pause / Resume Decision ──────────────────────────────────────────────

    // async shouldPauseMonitoring(orgId: string): Promise<boolean> {
    //     const [subscription, usage] = await Promise.all([
    //         this.getActiveSubscription(orgId),
    //         this.getOrgUsage(orgId),
    //     ])

    //     const limits = this.getStoredLimits(subscription)

    //     return limits.invoices !== -1 && (usage.invoiceCount ?? 0) >= limits.invoiceCount
    // }

    // ── Summary for Dashboard ────────────────────────────────────────────────

    async getUsageSummary(orgId: string) {
        const [org, subscription] = await Promise.all([
            this.db.organization.findOne({ clerkOrgId: orgId }),
            this.getActiveSubscription(orgId),
        ])

        const limits = this.getStoredLimits(subscription)
        const usage = (org as unknown as { usage?: Record<string, number> })?.usage ?? {}

        if (!subscription) {
            return {
                hasPaidPlan: false,
                planId: "basic",
                isFreePlan: true,
                interval: null,
                usage: {
                    invoices: usage.invoices,
                    emailAccounts: usage.emailAccounts,
                    mobileScanners: usage.mobileScanners,
                },
                limits: {
                    invoices: limits.invoices,
                    emailAccounts: limits.emailAccounts,
                    mobileScanners: limits.mobileScanners,
                    integrations: limits.integrations,
                },
                currentPeriodEnd: null,
            }
        }

        return {
            hasPaidPlan: subscription && subscription.planId !== "basic",
            planId: subscription?.planId ?? "basic",
            isFreePlan: !subscription || subscription.planId === "basic",
            interval: subscription?.interval ?? null,
            usage: {
                invoices: usage.invoices,
                emailAccounts: usage.emailAccounts,
                mobileScanners: usage.mobileScanners,
            },
            limits: {
                invoices: limits.invoices,
                emailAccounts: limits.emailAccounts,
                mobileScanners: limits.mobileScanners,
                integrations: limits.integrations,
            },
            currentPeriodEnd: subscription?.currentPeriodEnd ?? null,
        }
    }
}

export const usageService = new UsageService()