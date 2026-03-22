import { ContextProps } from "../../../_trpc"
import { IntegrationResource } from "@snappin/shared/integration/integration.schema"
import { TGetAccount } from "./getAccount.schema"
import { TRPCError } from "@trpc/server"
import { assertResourceAccess } from "../../../lib/assertResourceAccess"

export type GetAccount = {
    ctx: ContextProps
    input: TGetAccount
}

export async function getAccount({ ctx, input }: GetAccount): Promise<IntegrationResource | null> {
    const account = await ctx.db.integration
        .findOne({
            _id: input.accountId,
            orgId: ctx.orgId
        })
        .populate("user")
        .select("_id userId user appType appSlug appCategory identifierEmail config reAuthenticationRequired createdAt lastActivityAt updatedAt status")

    if (!account) {
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "Account not found"
        });
    }

    await assertResourceAccess({ userId: ctx.userId, orgId: ctx.orgId, resourceOwnerId: account?.userId })

    return account
}