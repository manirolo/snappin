import { ContextProps } from "../../_trpc"
import { TAddIntegration, TAddIntegrationResponse } from "./addIntegration.schema"
import { HttpError } from "@snappin/lib/http-error"
import { StatusCodes } from "http-status-codes"
import { OAuthSessionResource } from "@snappin/db/model/oauthSession.model"
import { EmailAppsStore } from "@snappin/apps/appRegistry"
import { AppCategory } from "@snappin/shared/apps/app.enum"
import { EmailApps } from "@snappin/apps/appRegistry.interface"
import { IntegrationResource } from "@snappin/db/model/integration.model"

type AddIntegration = {
    ctx: ContextProps,
    input: TAddIntegration
}

export async function AddIntegration({ ctx, input }: AddIntegration): Promise<TAddIntegrationResponse> {

    const session = await ctx.db.oauthSession.findOne({ state: input.state }) as OAuthSessionResource;

    if (!session) {
        throw new HttpError({ statusCode: StatusCodes.NOT_FOUND, message: "Session couldn't be found or expired. Please try again" })
    }

    // Same user request the session must be logged in
    if (session.userId != ctx.userId) {
        throw new HttpError({ statusCode: StatusCodes.UNAUTHORIZED, message: "Unauthorized" })
    }

    if (session.appCategory == AppCategory.EMAIL) {

        const provider = EmailAppsStore[session.appSlug] as EmailApps

        const { accessToken, accessTokenExpiresAt, refreshToken } = await provider.exchangeCodeForTokens({ code: input.code, codeVerifier: session.codeVerifier ?? "" })

        const { emailAddress } = await provider.getUserEmailAddress({ accessToken})
        
        const res = await provider?.startWatching({ accessToken })

        await ctx.db.integration.create({
            userId: session.userId,
            orgId: session.orgId,
            accessToken,
            refreshToken,
            accessTokenExpiresAt,
            appSlug: session.appSlug,
            appCategory: session.appCategory,
            scope: session.scope,
            identifierEmail: emailAddress,
            mailMonitored: res.historyId ? true : false,
            mailHistoryId: res.historyId,
            mailWatchExpiresAt: res.expiresAt
        }) as IntegrationResource

        return { redirectAfter: session.redirectAfter ?? "/" }
    }
    return { redirectAfter: "/" }
}