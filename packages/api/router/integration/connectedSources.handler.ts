import { ContextProps } from "@snappin/api/_trpc"
import { ConnectedSourceResponse } from "./connectedSource.schema";
import { AppType } from "@snappin/shared/apps/app.enum";

export type ConnectedSource = {
    ctx: ContextProps,
}

export async function connectedSource({ ctx }: ConnectedSource): Promise<ConnectedSourceResponse[]> {
    return await ctx.db.integration.find({ userId: ctx.userId, orgId: ctx.orgId, appType: AppType.SOURCE })
}