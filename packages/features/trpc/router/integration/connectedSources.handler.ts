import { ContextProps } from "@snappin/features/trpc/_trpc"
import { ConnectedSourceResponse, TConnectedSource } from "./connectedSource.schema";

export type ConnectedSource = {
    ctx: ContextProps,
    input: TConnectedSource
}

export async function connectedSource({ ctx, input }: ConnectedSource): Promise<ConnectedSourceResponse[]> {
    return await ctx.db.integration.find({ userId: ctx.userId, orgId: ctx.orgId, ...input })
}