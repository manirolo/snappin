import { ContextProps } from "@snappin/features/trpc/_trpc"
import { ConnectedSourceResponse, TConnectedSource } from "./connectedSource.schema"
import { TRPCError } from "@trpc/server"
import { assertResourceAccess } from "../../lib/assertResourceAccess"

export type ConnectedSource = {
    ctx: ContextProps
    input: TConnectedSource
}

export async function connectedSource({ ctx, input }: ConnectedSource): Promise<ConnectedSourceResponse[]> {

    if (!ctx.userId || !ctx.orgId) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Authentication required" })
    }

    await assertResourceAccess({ userId: ctx.userId, orgId: ctx.orgId })

    const query: Record<string, unknown> = {
        orgId: ctx.orgId,
    }

    if (input.appType) query.appType = input.appType
    if (input.appRoles) query.appRoles = { $in: [input.appRoles] }

    const results = await ctx.db.integration
        .find(query)
        .populate("user")
        .select("_id appType userId appSlug appCategory appRole identifierEmail metadata.phone reAuthenticationRequired status lastActivityAt updatedAt")
        .sort({ createdAt: -1 })
        .lean()

    return results as unknown as ConnectedSourceResponse[]
}