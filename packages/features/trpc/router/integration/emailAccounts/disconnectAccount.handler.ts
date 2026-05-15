import { HttpError } from "@snappin/lib/http-error"
import { ContextProps } from "../../../_trpc"
import { TDisconnectAccount } from "./disconnectAccount.schema"
import { StatusCodes } from "http-status-codes"
import { IntegrationResource } from "@snappin/shared/integration/integration.schema"
import { assertResourceAccess } from "../../../lib/assertResourceAccess"
import { IntegrationService } from "@snappin/features/integration/services/integration.service"
import { UsageService } from "@snappin/features/billing/service/usage.service"

export type DisconnectAccount = {
    ctx: ContextProps
    input: TDisconnectAccount
}

export async function disconnectAccount({ ctx, input }: DisconnectAccount): Promise<void> {
    if (!input.integrationId) {
        throw new HttpError({ statusCode: StatusCodes.BAD_GATEWAY, message: "Select a valid integration app to remove" })
    }

    const integration = await ctx.db.integration.findOne({ _id: input.integrationId }) as IntegrationResource

    if (!integration || !integration.appCategory || !integration.appSlug) {
        throw new HttpError({ statusCode: StatusCodes.NOT_FOUND, message: "Selected integration app not found" })
    }

    await assertResourceAccess({ userId: ctx.userId, orgId: ctx.orgId, resourceOwnerId: integration?.userId })

    const integrationService = new IntegrationService()
    await integrationService.removeOne(input.integrationId)

    const usageService = new UsageService()
    await usageService.decrement(ctx.orgId ?? "", "emailAccounts")
}