import { HttpError } from "@snappin/lib/http-error"
import { ContextProps } from "../../_trpc"
import { TRemoveIntegration } from "./removeIntegration.schema"
import { StatusCodes } from "http-status-codes"
import { OAuthProviders } from "./providers/provider"
import { env } from "@snappin/env"
import { IntegrationResource } from "@snappin/db/model/integration.model"
import { EmailAppsStore } from "@snappin/apps/appRegistry"
import { EmailApps } from "@snappin/apps/appRegistry.interface"

type RemoveIntegration = {
    ctx: ContextProps
    input: TRemoveIntegration
}

export async function RemoveIntegration({ ctx, input }: RemoveIntegration): Promise<void> {
    if (!input.integrationId) {
        throw new HttpError({ statusCode: StatusCodes.BAD_GATEWAY, message: "Select a valid integration app to remove" })
    }

    const integration = await ctx.db.integration.findOne({ _id: input.integrationId }) as IntegrationResource

    if (!integration) {
        throw new HttpError({ statusCode: StatusCodes.NOT_FOUND, message: "Selected integration app not found" })
    }

    const provider = EmailAppsStore[input.appSlug] as EmailApps

    const token = await provider.getAccessToken({ integration })

    provider.stopWatching({ accessToken: token.accessToken })

    provider.revokeToken({ token: integration.refreshToken })

    await ctx.db.integration.deleteOne({ _id: input.integrationId })
}