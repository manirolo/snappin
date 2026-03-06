import { ContextProps } from "@snappin/features/trpc/_trpc"
import { ConnectedEmailAccountsResponse } from "./connectedEmailAccounts.schema";
import { AppRole } from "@snappin/shared/apps/app.schema";

export type ConnectedEmailAccounts = {
  ctx: ContextProps;
};

export async function connectedEmailAccounts({
  ctx,
}: ConnectedEmailAccounts): Promise<ConnectedEmailAccountsResponse[]> {
  return ctx.db.integration
    .find({ userId: ctx.userId, orgId: ctx.orgId, appRole: AppRole.EMAIL_SOURCE })
    .select("_id appType appSlug appCategory appRole identifierEmail config.mailMonitored reAuthenticationRequired status updatedAt")
    .sort({ createdAt: -1 });
}