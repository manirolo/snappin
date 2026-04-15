import { HttpError } from "@snappin/lib/http-error"
import { ContextProps } from "../../_trpc"
import { TRemoveIntegration } from "./removeIntegration.schema"
import { StatusCodes } from "http-status-codes"
import { IntegrationResource } from "@snappin/shared/integration/integration.schema"
import { assertResourceAccess } from "../../lib/assertResourceAccess"
import { IntegrationService } from "@snappin/features/integration/services/integration.service"

export type RemoveIntegration = {
    ctx: ContextProps
    input: TRemoveIntegration
}

export async function removeIntegration({ ctx, input }: RemoveIntegration): Promise<void> {
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

}