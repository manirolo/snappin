import { ContextProps } from "@snappin/features/trpc/_trpc"
import { ConnectedEmailAccountsResponse } from "./connectedEmailAccounts.schema";
import { AppRole } from "@snappin/shared/apps/app.schema";
import { TRPCError } from "@trpc/server";
import { assertResourceAccess } from "../../lib/assertResourceAccess";

export type ConnectedEmailAccounts = {
  ctx: ContextProps;
};

export async function connectedEmailAccounts({
  ctx,
}: ConnectedEmailAccounts): Promise<ConnectedEmailAccountsResponse[]> {
  if (!ctx.userId || !ctx.orgId) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Authentication required" })
  }

  await assertResourceAccess({ userId: ctx.userId, orgId: ctx.orgId })

  return ctx.db.integration
    .find({ userId: ctx.userId, orgId: ctx.orgId, appRole: AppRole.EMAIL_SOURCE })
    .populate("user")
    .select("_id appType userId appSlug appCategory appRole identifierEmail config.mailMonitored reAuthenticationRequired status lastActivityAt updatedAt")
    .sort({ createdAt: -1 });
}