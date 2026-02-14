import { ContextProps } from "@snappin/api/_trpc"
import { ConnectedEmailAccountsResponse } from "./connectedEmailAccounts.schema";
import { AppCategory } from "@snappin/shared/apps/app.enum";

export type ConnectedEmailAccounts = {
    ctx: ContextProps,
}

export async function connectedEmailAccounts({ ctx }:ConnectedEmailAccounts): Promise<ConnectedEmailAccountsResponse[]>  {
    return await ctx.db.integration.find({ userId: ctx.userId, orgId: ctx.orgId,  appCategory: AppCategory.EMAIL })
}