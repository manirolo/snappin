import { adminProcedure, createTRPCRouter, orgProcedure, publicProcedure } from "../../_trpc";
import { createCheckout, CreateCheckout } from "./createCheckout.handler";
import { ZCreateCheckout } from "./createCheckout.schema";
import { getPlans, GetPlans } from "./getPlans.handler";
import { createPlan, CreatePlan } from "./createPlan.handler";
import { updatePlan, UpdatePlan } from "./updatePlan.handler";
import { ZCreatePlan, ZUpdatePlan } from "./plan.schema";
import { usage, Usage } from "./usage.handler";
import { getCustomerPortalUrl, GetCustomerPortalUrl } from "./getCustomerPortalUrl.handle";
import { CancelSubscription, cancelSubscription } from "./cancelSubscription.handler"
// import { updateSubscription, UpdateSubscription } from "./updateSubscription.handler";
// import { ZUpdateSubscription } from "./updateSubscription.schema";

export const billingRouter = createTRPCRouter({
    usage: orgProcedure.query(async (opts: Usage) => usage(opts)),
    getActivePlans: orgProcedure
        .query(async (opts: GetPlans) =>
            getPlans({ ...opts, onlyActive: true, publicCatalogOnly: true })),
    createCheckout: publicProcedure
        .input(ZCreateCheckout)
        .mutation(async (opts: CreateCheckout) => createCheckout(opts)),
    // updateSubscription: orgProcedure.input(ZUpdateSubscription).mutation(async (opts: UpdateSubscription) => updateSubscription(opts)),
    getCustomerPortalUrl: orgProcedure.mutation(async (opts: GetCustomerPortalUrl) => getCustomerPortalUrl(opts)),
    cancelSubscription: adminProcedure.mutation(async (opts: CancelSubscription) => cancelSubscription(opts)),
    listPlans: adminProcedure
        .query(async (opts: GetPlans) => getPlans(opts)),
    createPlan: adminProcedure
        .input(ZCreatePlan)
        .mutation(async (opts: CreatePlan) => createPlan(opts)),
    updatePlan: adminProcedure
        .input(ZUpdatePlan)
        .mutation(async (opts: UpdatePlan) => updatePlan(opts)),
})