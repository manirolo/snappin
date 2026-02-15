import { IntegrationResource } from "@snappin/shared/integration/integration.schema"
import { ContextProps } from "../../_trpc"
import { TUpdateIntegration } from "./updateIntegration.schema"

export type UpdateIntegration = {
    ctx: ContextProps
    input: TUpdateIntegration
}

export async function updateIntegration({ ctx, input }: UpdateIntegration): Promise<IntegrationResource | null> {
    return await ctx.db.integration.findOneAndUpdate({ _id: input.integrationId }, { mailMonitored: input.mailMonitored })
}