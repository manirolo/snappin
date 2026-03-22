import { IntegrationResource } from "@snappin/shared/integration/integration.schema"
import { ContextProps } from "../../_trpc"
import { TUpdateIntegration } from "./updateIntegration.schema"
import { TRPCError } from "@trpc/server"
import { assertResourceAccess } from "../../lib/assertResourceAccess"

export type UpdateIntegration = {
    ctx: ContextProps
    input: TUpdateIntegration
}

export async function updateIntegration({ ctx, input }: UpdateIntegration): Promise<IntegrationResource | null> {
    if (!input.integrationId) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Select a valid integration app to update" })
    }
    const integration = await ctx.db.integration.findOne({ _id: input.integrationId, orgId: ctx?.orgId })

    if (!integration) throw new TRPCError({ code: "NOT_FOUND", message: "Integration not found" })

    if (!integration || !integration.appCategory || !integration.appSlug) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Selected integration app not found" })
    }

    await assertResourceAccess({ userId: ctx.userId, orgId: ctx.orgId, resourceOwnerId: integration?.userId })
    
    return await ctx.db.integration.findOneAndUpdate({ _id: input.integrationId }, input.data, { new: true })
}