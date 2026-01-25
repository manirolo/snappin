import { IntegrationResource } from "@snappin/db/model/integration.model"
import { ContextProps } from "../../_trpc"
import { TUpdateIntegration } from "./updateIntegration.schema"

type UpdateIntegration = {
    ctx: ContextProps
    input: TUpdateIntegration
}

export async function UpdateIntegration({ ctx, input }: UpdateIntegration): Promise<IntegrationResource | null> {
    return await ctx.db.integration.findOneAndUpdate({ _id: input.integrationId }, { mailMonitored: input.mailMonitored })
}