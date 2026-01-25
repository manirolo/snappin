import { ContextProps } from "../../_trpc"
import { GetIntegrationResponse, TGetIntegration } from "./getIntegration.schema"

type GetIntegration = {
    ctx: ContextProps,
    input: TGetIntegration
}

export async function GetIntegration({ ctx, input }: GetIntegration): Promise<GetIntegrationResponse[] | undefined> {
    if (!input.appCategory) {
        return
    }

    return await ctx.db.integration.find({
        userId: ctx.userId,
        orgId: ctx.orgId ?? null,
        appCategory: input.appCategory
    }).select("_id appSlug identifierEmail mailMonitored status")
}