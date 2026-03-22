import { ContextProps } from "../../_trpc"
import { assertResourceAccess } from "../../lib/assertResourceAccess"
import { GetIntegrationResponse } from "./getIntegration.schema"
import { TGetIntegration } from "./getIntegration.schema"

export type GetIntegration = {
    ctx: ContextProps
    input?: TGetIntegration
}

export async function getIntegration({ ctx, input }: GetIntegration): Promise<GetIntegrationResponse | null> {
    const filter: Record<string, unknown> = {
        userId: ctx.userId,
        ...(ctx.orgId && { orgId: ctx.orgId }),
    }

    if (input?.appSlug?.length) {
        filter.appSlug = { $in: input.appSlug }
    }

    if (input?.integrationId?.length) {
        filter._id = { $in: input.integrationId }
    }

    const integration = await ctx.db.integration.findOne(filter).select("appType appSlug appType appRole config identifierEmail status reAuthenticationRequired")

    await assertResourceAccess({ userId: ctx.userId, orgId: ctx.orgId, resourceOwnerId: integration?.userId })

    return integration
}