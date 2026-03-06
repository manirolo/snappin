import { ContextProps } from "../../_trpc"
import { TAddIntegration, TAddIntegrationResponse } from "./addIntegration.schema"
import { HttpError } from "@snappin/lib/http-error"
import { StatusCodes } from "http-status-codes"
import { OAuthSessionResource } from "@snappin/shared/auth/oauthSession.schema"
import { EmailAppsStore } from "@snappin/apps/appRegistry"
import { AppCategory, EmailAppSlug } from "@snappin/shared/apps/app.schema"
import { IntegrationResource } from "@snappin/shared/integration/integration.schema"
import { clerk } from "@snappin/features/trpc/config/clerk"

export type AddIntegration = {
    ctx: ContextProps,
    input: TAddIntegration
}

export async function addIntegration({ ctx, input }: AddIntegration): Promise<TAddIntegrationResponse> {

    const session: OAuthSessionResource = await ctx.db.oauthSession.findOne({ state: input.state }) as OAuthSessionResource;

    if (!session) {
        throw new HttpError({ statusCode: StatusCodes.NOT_FOUND, message: "Session couldn't be found or expired. Please try again" })
    }

    if (session.appCategory == AppCategory.EMAIL) {

        const appSlug = session.appSlug
        if (!appSlug || !(appSlug in EmailAppsStore)) {
            throw new HttpError({ statusCode: StatusCodes.BAD_REQUEST, message: "Session app slug is missing or invalid" })
        }
        const provider = EmailAppsStore[appSlug as EmailAppSlug]

        if (session.reAuthenticateSession) {
            const { accessToken, accessTokenExpiresAt, refreshToken } = await provider.exchangeCodeForTokens({ code: input.code, codeVerifier: session.codeVerifier })

            await ctx.db.integration.findOneAndUpdate(
                { _id: session.reAuthenticate?.integrationId },
                { accessToken, accessTokenExpiresAt, refreshToken, reAuthenticationRequired: false }
            )

            return { redirectAfter: session.redirectAfter ?? "/" }

        }

        const integrationData = await provider.buildIntegrationData({ code: input.code, codeVerifier: session.codeVerifier })

        await ctx.db.integration.create({
            userId: session.userId,
            orgId: session.orgId,
            reAuthenticationRequired: false,
            appSlug: session.appSlug,
            appCategory: session.appCategory,
            appRole: session.appRole,
            appType: session.appType,
            scope: session.scope,
            ...integrationData,
        }) as IntegrationResource

        await clerk.users.updateUserMetadata(session.userId, { publicMetadata: { onboardingComplete: true } })

        return { redirectAfter: session.redirectAfter ?? "/" }
    }
    return { redirectAfter: "/" }
}