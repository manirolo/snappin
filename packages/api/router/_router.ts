import { createTRPCRouter } from "../_trpc";
import { integrationRouter } from "./integration/_router";
import { invoiceRouter } from "./invoice/_router";
import { onboardingRouter } from "./onboarding/_router";
import { vendorRouter } from "./vendor/_router";

export const router = createTRPCRouter({
    onboarding: onboardingRouter,
    integration: integrationRouter,
    invoices: invoiceRouter,
    vendor: vendorRouter
})