import { ContextProps } from "@snappin/features/trpc/_trpc"
import { ConnectedMobileScannersResponse } from "./connectedMobileScanners.schema";
import { AppRole } from "@snappin/shared/apps/app.schema";
import { clerk } from "@snappin/features/trpc/config/clerk";
import { TRPCError } from "@trpc/server";

export type ConnectedMobileScanners = {
    ctx: ContextProps,
}

export async function connectedMobileScanners({ ctx }: ConnectedMobileScanners): Promise<ConnectedMobileScannersResponse[]> {

    if (!ctx.userId || !ctx.orgId) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Authentication required" })
    }

    let isMember = false
    try {
        const { data: memberships } = await clerk.users.getOrganizationMembershipList({
            userId: ctx.userId,
        })
        isMember = memberships.some(
            (membership) => membership.organization.id === ctx.orgId
        )
    } catch {
        throw new TRPCError({ code: "FORBIDDEN", message: "You are not a member of this organization" })
    }

    if (!isMember) {
        throw new TRPCError({ code: "FORBIDDEN", message: "You are not a member of this organization" })
    }

    return await ctx.db.integration
        .find({ orgId: ctx.orgId, appRoles: [AppRole.MOBILE_SCANNER] })
        .populate("user")
        .select("_id orgId userId appSlug config.phone status updatedAt")
        .sort({ createdAt: -1 })
}