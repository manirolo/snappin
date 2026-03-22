import { HttpError } from "@snappin/lib/http-error"
import { ContextProps } from "../../_trpc"
import { TRemoveIntegration } from "./removeIntegration.schema"
import { StatusCodes } from "http-status-codes"
import { IntegrationResource } from "@snappin/shared/integration/integration.schema"
import { AppCategory } from "@snappin/shared/apps/app.schema"
import { SnappinError } from "@snappin/lib/error/snappin.error"
import { resolveProvider, AnyEmailProvider } from "@snappin/apps/lib/resolveProvider"
import { assertResourceAccess } from "../../lib/assertResourceAccess"

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

    if (integration.appCategory == AppCategory.COMMUNICATION) {
        await ctx.db.integration.deleteOne({ _id: input.integrationId })
        return
    }

    const provider = resolveProvider(integration.appCategory, integration.appSlug)

    if (!integration.refreshToken) throw new SnappinError("Authentication failed", "invalid_integration_request")

    if (integration.appCategory == AppCategory.EMAIL) {
        const emailProvider = provider as AnyEmailProvider
        await emailProvider.stopWatching({ integration })
    }

    if (integration.refreshToken) {
        try {
            const otherIntegrationWithSameProvider = await ctx.db.integration.findOne({
                _id: { $ne: input.integrationId },
                identifierEmail: integration.identifierEmail,
                provider: integration.provider,
            });
            if (!otherIntegrationWithSameProvider) {
                await provider.revokeToken({
                    token: integration.refreshToken,
                    accessToken: integration.accessToken,
                });
                console.log("Refresh token revoked");
            } else {
                console.log("Other integrations exist for this provider — skipping token revocation");
            }
        }
        catch (err) {
            const isInvalidToken = err instanceof Error && err.message.includes("invalid_token")
            if (!isInvalidToken) throw err
            console.warn("[removeIntegration] Token already expired or revoked, continuing with deletion")
        }
    }
    await ctx.db.integration.deleteOne({ _id: input.integrationId })

}