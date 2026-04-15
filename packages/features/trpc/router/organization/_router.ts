import { adminProcedure, createTRPCRouter, orgProcedure } from "../../_trpc";
import { getOrganization, GetOrganization } from "./getOrganization.handler";
import { inviteMember, InviteMember } from "./inviteMember.handler";
import { updateOrganization, UpdateOrganization, ZUpdateOrganizationInput } from "./updateOrganization.handler";
import { removeMember, RemoveMember, ZRemoveMemberInput } from "./removeMember.handler"

export const organizationRouter = createTRPCRouter({
    getOrganization: orgProcedure
        .query(async (opts: GetOrganization) => getOrganization(opts)),

    inviteMember: adminProcedure
        .mutation(async (opts: InviteMember) => inviteMember(opts)),

    removeMember: adminProcedure
        .input(ZRemoveMemberInput)
        .mutation(async (opts: RemoveMember) => removeMember(opts)),

    updateOrganization: adminProcedure
        .input(ZUpdateOrganizationInput)
        .mutation(async (opts: UpdateOrganization) => updateOrganization(opts)),
});