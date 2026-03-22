import { adminProcedure, createTRPCRouter, orgProcedure } from "../../_trpc";
import { getOrganization, GetOrganization } from "./getOrganization.handler";
import { updateOrganization, UpdateOrganization, ZUpdateOrganizationInput } from "./updateOrganization.handler";

export const organizationRouter = createTRPCRouter({
    getOrganization: orgProcedure
        .query(async (opts: GetOrganization) => getOrganization(opts)),

    updateOrganization: adminProcedure
        .input(ZUpdateOrganizationInput)
        .mutation(async (opts: UpdateOrganization) => updateOrganization(opts)),
});