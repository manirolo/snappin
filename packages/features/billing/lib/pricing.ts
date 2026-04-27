import { AppSlug } from "@snappin/shared/apps/app.schema";

export enum PricingSlug {
  BASIC = "basic",
  STARTER = "starter",
  SCALE = "scale",
  PREMIUM = "premium"
};

export const PRICING_CONFIG = {
  plans: [
    {
      id: PricingSlug.BASIC,
      label: "Basic",
      docsLabel: { monthly: "10", yearly: "10" },
      displayOnSite: false,
      limits: {
        monthlyDocs: 10,
        yearlyDocs: 10,
        emailAccounts: 1,
        mobileScanners: 1,
        integrations: [AppSlug.GOOGLE_DRIVE],
      },
      pricing: {
        monthly: { original: 0 },
        yearly: { original: 0 },
      },
      features: {
        monthly: ["10 credits per month", "1 email accounts", "1 whatsapp account", "Unlimited members", "Retroactive", "Web portal extraction (Coming)", "Bank statements conciliations (Coming)"],
        yearly: ["10 credits per month", "1 email accounts", "1 whatsapp account", "Unlimited members", "Retroactive", "Web portal extraction (Coming)", "Bank statements conciliations (Coming)"],
      },
      integrations: ["Google Drive"],
    },
    {
      id: PricingSlug.STARTER,
      label: "Starter",
      docsLabel: { monthly: "50", yearly: "600" },
      displayOnSite: true,
      limits: {
        monthlyDocs: 50,
        yearlyDocs: 600,
        emailAccounts: 3,
        mobileScanners: 3,
        integrations: [AppSlug.GOOGLE_DRIVE, AppSlug.XERO],
      },
      pricing: {
        monthly: { original: 5 },
        yearly: { original: 50 },
      },
      features: {
        monthly: ["50 credits per month", "3 email accounts", "3 whatsapp accounts", "All integrations", "Web portal extraction (Coming)", "Bank statements conciliations (Coming)"],
        yearly: ["600 credits per year", "3 email accounts", "3 whatsapp accounts", "All integrations", "Web portal extraction (Coming)", "Bank statements conciliations (Coming)"],
      },
      integrations: ["Google Drive", "Xero", "Quickbooks (Coming)"],
    },
    {
      id: PricingSlug.SCALE,
      label: "Scale",
      docsLabel: { monthly: "500", yearly: "6,000" },
      displayOnSite: true,
      limits: {
        monthlyDocs: 500,
        yearlyDocs: 6000,
        emailAccounts: 5,
        mobileScanners: 5,
        integrations: [AppSlug.GOOGLE_DRIVE, AppSlug.XERO],
      },
      pricing: {
        monthly: { original: 19 },
        yearly: { original: 190 },
      },
      features: {
        monthly: ["500 credits per month", "5 email accounts", "5 whatsapp accounts", "Everything in starter plan"],
        yearly: ["6,000 credits per year", "5 email accounts", "5 whatsapp accounts", "Everything in starter plan"],
      },
      integrations: ["Google Drive", "Xero", "Quickbooks (Coming)"],
    },
    {
      id: PricingSlug.PREMIUM,
      label: "Premium",
      docsLabel: { monthly: "1k", yearly: "12k" },
      displayOnSite: true,
      limits: {
        monthlyDocs: 1000,
        yearlyDocs: 12000,
        emailAccounts: 10,
        mobileScanners: 10,
        integrations: [AppSlug.GOOGLE_DRIVE, AppSlug.XERO],
      },
      pricing: {
        monthly: { original: 49 },
        yearly: { original: 490 },
      },
      features: {
        monthly: ["1000 credits per month", "10 email accounts", "10 whatsapp accounts", "Dedicated support", "Everything in scale plan"],
        yearly: ["12,000 credits per year", "10 email accounts", "10 whatsapp accounts", "Dedicated support", "Everything in scale plan"],
      },
      integrations: ["Google Drive", "Xero", "Quickbooks (Coming)"],
    },
  ],
} as const;

export type Plan = (typeof PRICING_CONFIG.plans)[number];
export type PlanId = Plan["id"];
export type BillingCycle = "monthly" | "yearly";
export type PlanLimits = Plan["limits"];

/** Get full plan object by id */
export function getPlan(planId: PlanId): Plan {
  return PRICING_CONFIG.plans.find((p) => p.id === planId) as Plan;
}

/** Get plan limits — use on backend for quota enforcement */
export function getPlanLimits(planId: PlanId): PlanLimits {
  return getPlan(planId).limits;
}

/** Check if user has hit their monthly doc quota */
export function isOverDocQuota(
  planId: PlanId,
  currentMonthDocs: number
): boolean {
  return currentMonthDocs >= getPlanLimits(planId).monthlyDocs;
}

/** Get remaining docs for this billing period */
export function getRemainingDocs(
  planId: PlanId,
  currentMonthDocs: number
): number {
  return Math.max(0, getPlanLimits(planId).monthlyDocs - currentMonthDocs);
}

/** Get display price — respects early user discount */
export function getPrice(
  planId: PlanId,
  cycle: BillingCycle,
  isEarlyUser: boolean
): { display: number; original: number; hasDiscount: boolean } {
  const plan = getPlan(planId);
  const pricing = plan.pricing[cycle];
  return {
    display: pricing.original,
    original: pricing.original,
    hasDiscount: isEarlyUser,
  };
}

/** Flat STEPS array shaped for the billing slider */
export const STEPS = PRICING_CONFIG.plans.map((p) => ({
  id: p.id,
  label: p.label,
  docsLabel: p.docsLabel,
  docs: p.limits.monthlyDocs,
  monthly: p.pricing.monthly.original,
  yearly: p.pricing.yearly.original
}));