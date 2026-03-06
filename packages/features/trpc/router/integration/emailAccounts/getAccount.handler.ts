import { ContextProps } from "../../../_trpc"
import { IntegrationResource } from "@snappin/shared/integration/integration.schema"
import { TGetAccount } from "./getAccount.schema"

export type GetAccount = {
    ctx: ContextProps
    input: TGetAccount
}

export async function getAccount({ ctx, input }: GetAccount): Promise<IntegrationResource | null> {
    return await ctx.db.integration.findOne({ _id: input.accountId }).select("_id appType appSlug appCategory identifierEmail config reAuthenticationRequired createdAt status")
}