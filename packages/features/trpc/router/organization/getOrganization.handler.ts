import { OrganizationResource } from "@snappin/shared/organization/organization.schema";
import { ContextProps } from "../../_trpc"
import { assertResourceAccess } from "../../lib/assertResourceAccess";
import { TRPCError } from "@trpc/server";

export type GetOrganization = {
    ctx: ContextProps
}

export async function getOrganization({ ctx }: GetOrganization): Promise<OrganizationResource | null> {
    await assertResourceAccess({ userId: ctx.userId, orgId: ctx.orgId })
    const organization = await ctx.db.organization
        .findOne({ clerkOrgId: ctx.orgId });

    if (!organization) {
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "Organization not found"
        })
    }

    return organization
}