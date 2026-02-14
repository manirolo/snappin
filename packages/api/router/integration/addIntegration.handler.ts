import { ContextProps } from "../../_trpc"
import { TAddIntegration, TAddIntegrationResponse } from "./addIntegration.schema"
import { HttpError } from "@snappin/lib/http-error"
import { StatusCodes } from "http-status-codes"
import { OAuthSessionResource } from "@snappin/shared/auth/oauthSession.schema"
import { EmailAppsStore } from "@snappin/apps/appRegistry"
import { AppCategory, AppSlug } from "@snappin/shared/apps/app.enum"
import { IntegrationResource } from "@snappin/shared/integration/integration.schema"
import { clerk } from "@snappin/api/config/clerk"
import { EmailApps } from "@snappin/apps/appRegistry.interface"

export type AddIntegration = {
    ctx: ContextProps,
    input: TAddIntegration
}

export async function addIntegration({ ctx, input }: AddIntegration): Promise<TAddIntegrationResponse> {

    const session: OAuthSessionResource = await ctx.db.oauthSession.findOne({ state: input.state }) as OAuthSessionResource;

    if (!session) {
        throw new HttpError({ statusCode: StatusCodes.NOT_FOUND, message: "Session couldn't be found or expired. Please try again" })
    }

    // Same user request the session must be logged in
    if (session.userId != ctx.userId) {
        throw new HttpError({ statusCode: StatusCodes.UNAUTHORIZED, message: "Unauthorized" })
    }

    if (session.appCategory == AppCategory.EMAIL) {

        const appSlug = session.appSlug
        if (!appSlug || !(appSlug in EmailAppsStore)) {
            throw new HttpError({ statusCode: StatusCodes.BAD_REQUEST, message: "Session app slug is missing or invalid" })
        }
        const provider = EmailAppsStore[appSlug as AppSlug] as EmailApps

        const { accessToken, accessTokenExpiresAt, refreshToken } = await provider.exchangeCodeForTokens({ code: input.code, codeVerifier: session.codeVerifier ?? "" })

        const { emailAddress } = await provider.getUserEmailAddress({ accessToken })

        if (session.reAuthenticateSession) {

            await ctx.db.integration.findOneAndUpdate(
                { _id: session.reAuthenticate?.integrationId },
                { accessToken, accessTokenExpiresAt, refreshToken, reAuthenticationRequired: false }
            )

            return { redirectAfter: session.redirectAfter ?? "/" }

        }

        const watch = await provider.startWatching({ accessToken })

        await ctx.db.integration.create({
            userId: session.userId,
            orgId: session.orgId,
            accessToken,
            refreshToken,
            accessTokenExpiresAt,
            reAuthenticationRequired: false,
            appSlug: session.appSlug,
            appCategory: session.appCategory,
            appType: session.appType,
            scope: session.scope,
            identifierEmail: emailAddress,
            mailMonitored: accessToken && true,
            mailHistoryId: null,
            mailDeltaToken: null,
            mailWatchExpiresAt: null
        }) as IntegrationResource

        await clerk.users.updateUserMetadata(session.userId, { publicMetadata: { onboardingComplete: true}})

        return { redirectAfter: session.redirectAfter ?? "/" }
    }
    return { redirectAfter: "/" }
}