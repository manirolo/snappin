import { createTRPCRouter } from "../_trpc";
import { billingRouter } from "./billing/_router";
import { exportDocument } from "./export/_router";
import { integrationRouter } from "./integration/_router";
import { invoiceRouter } from "./invoice/_router";
import { onboardingRouter } from "./onboarding/_router";
import { organizationRouter } from "./organization/_router";
import { scanPastInvoiceRouter } from "./retroSearch/_router";
import { userRouter } from "./user/_router";
import { vendorRouter } from "./vendor/_router";

export const router = createTRPCRouter({
    onboarding: onboardingRouter,
    integration: integrationRouter,
    invoices: invoiceRouter,
    vendor: vendorRouter,
    retroSearch: scanPastInvoiceRouter,
    organization: organizationRouter,
    export: exportDocument,
    billing: billingRouter,
    user: userRouter,
})