import { HttpError } from "@snappin/lib/http-error"
import { ContextProps } from "../../../_trpc"
import { TRemoveMobileScanner } from "./removeMobileScanner.schema"
import { StatusCodes } from "http-status-codes"
import { IntegrationResource } from "@snappin/shared/integration/integration.schema"
import { assertResourceAccess } from "../../../lib/assertResourceAccess"
import { IntegrationService } from "@snappin/features/integration/services/integration.service"
import { UsageService } from "@snappin/features/billing/service/usage.service"

export type RemoveMobileScanner = {
    ctx: ContextProps
    input: TRemoveMobileScanner
}

export async function removeMobileScanner({ ctx, input }: RemoveMobileScanner): Promise<void> {
    if (!input.integrationId) {
        throw new HttpError({ statusCode: StatusCodes.BAD_GATEWAY, message: "Select a valid mobile scanner to remove" })
    }

    const integration = await ctx.db.integration.findOne({ _id: input.integrationId }) as IntegrationResource

    if (!integration || !integration.appCategory || !integration.appSlug) {
        throw new HttpError({ statusCode: StatusCodes.NOT_FOUND, message: "Selected integration app not found" })
    }

    await assertResourceAccess({ userId: ctx.userId, orgId: ctx.orgId, resourceOwnerId: integration?.userId })

    const integrationService = new IntegrationService()
    await integrationService.removeOne(input.integrationId)


    const usageService = new UsageService()
    await usageService.decrement(ctx.orgId ?? "", "mobileScanners")
}