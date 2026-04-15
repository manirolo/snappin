// shared/billing/plan.schema.ts
import { AppSlug } from "../apps/app.schema";

export const PLAN_SLUG_ORDER = ["basic", "starter", "scale", "premium"] as const;
export type PlanSlug = (typeof PLAN_SLUG_ORDER)[number];
export const PlanSlug = {
    BASIC: "basic",
    STARTER: "starter",
    SCALE: "scale",
    PREMIUM: "premium",
} as const;

export enum PlanInterval {
  MONTHLY = "monthly",
  YEARLY = "yearly"
};

export interface PlanLimitsResource {
    invoices: number
    emailAccounts: number
    mobileScanners: number
    integrations: {
        [AppSlug.XERO]: boolean
        [AppSlug.GOOGLE_DRIVE]: boolean
    }
}

export interface PlanResource {
    slug: PlanSlug;
    name: string;
    lsVariantId: number;    // LS targets variant for checkout & upgrade
    lsProductId: number;    // LS product (parent of variant)
    amount: number;
    currency: string;
    interval: PlanInterval;
    isActive: boolean;
    createdAt: number;
    updatedAt: number;
}