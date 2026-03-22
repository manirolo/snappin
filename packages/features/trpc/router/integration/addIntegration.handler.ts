import { ContextProps } from "../../_trpc"
import { TAddIntegration, TAddIntegrationResponse } from "./addIntegration.schema"
import { OAuthSessionResource } from "@snappin/shared/auth/oauthSession.schema"
import { resolveProvider } from "@snappin/apps/lib/resolveProvider"
import { IntegrationResource } from "@snappin/shared/integration/integration.schema"
import { IntegrationStatus } from "@snappin/shared/integration/status.enum"
import { TRPCError } from "@trpc/server"
import { assertResourceAccess } from "../../lib/assertResourceAccess"
import { env } from "@snappin/env"
import { appMetadata } from "@snappin/apps/app.metadata"

export type AddIntegration = {
    ctx: ContextProps
    input: TAddIntegration
}

export async function addIntegration({ ctx, input }: AddIntegration): Promise<TAddIntegrationResponse> {
    // ── 1. Auth — must be org member ──────────────────────────────────────────
    await assertResourceAccess({ userId: ctx.userId, orgId: ctx.orgId })

    // ── 2. Fetch & validate OAuth session ─────────────────────────────────────
    const session = await ctx.db.oauthSession.findOne({ state: input.state }) as OAuthSessionResource

    if (!session || !session.appCategory || !session.appSlug) {
        throw new TRPCError({
            code: "NOT_FOUND",
            message: "Session couldn't be found or expired. Please try again",
        })
    }

    const provider = resolveProvider(session.appCategory, session.appSlug)
    
    const fullCallbackUrl = input.callbackUrl;

    // ── Re-auth path ──────────────────────────────────────────────────────────
    if (session.reAuthenticateSession) {
        const existingIntegration = await ctx.db.integration.findOne({
            _id: session.reAuthenticate?.integrationId,
            orgId: ctx.orgId,
        })

        if (!existingIntegration) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Integration not found or does not belong to your organization",
            })
        }

        // Owner or org admin can re-authenticate
        await assertResourceAccess({
            userId: ctx.userId,
            orgId: ctx.orgId,
            resourceOwnerId: existingIntegration.userId?.toString(),
        })

        const { accessToken, accessTokenExpiresAt, refreshToken } = await provider.exchangeCodeForTokens({
            code: input.code,
            codeVerifier: session.codeVerifier,
            callbackUrl: fullCallbackUrl,
            state: input.state,
        })

        await ctx.db.integration.findOneAndUpdate(
            { _id: session.reAuthenticate?.integrationId, orgId: ctx.orgId },
            {
                accessToken,
                accessTokenExpiresAt,
                refreshToken,
                reAuthenticationRequired: false,
                status: IntegrationStatus.CONNECTED,
            }
        )

        return { redirectAfter: session.redirectAfter ?? "/home" }
    }

    // ── New integration path ───────────────────────────────────────────────────

    // ── 4. Resolve identity — tokens only, no watch started yet ──────────────
    const { accessToken, refreshToken, accessTokenExpiresAt, identifierEmail } =
        await provider.resolveIdentity({
            code: input.code,
            codeVerifier: session.codeVerifier,
            callbackUrl: fullCallbackUrl,
            state: input.state,
        })

    if (!identifierEmail) {
        await provider.revokeToken({ token: refreshToken })
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Could not resolve account identifier from provider",
        })
    }

    // ── 5. Duplicate check BEFORE any watch/subscription is started ───────────
    const isAccountAlreadyConnected = await ctx.db.integration.findOne({
        identifierEmail,
        appSlug: session.appSlug,
    })

    if (isAccountAlreadyConnected) {
        // Safe to revoke — no watch was started, existing watch is untouched
        // await provider.revokeToken({ token: refreshToken })
        return { redirectAfter: `${env.app.frontend_url}/already-account-connected` }
    }

    // ── 6. Build integration data — starts watch/subscription ─────────────────
    const integrationData = await provider.buildIntegrationData({
        accessToken,
        refreshToken,
        accessTokenExpiresAt,
    })

    const oauthProvider = appMetadata[session.appSlug].provider

    // ── 7. Persist ────────────────────────────────────────────────────────────
    await ctx.db.integration.create({
        userId: session.userId,
        orgId: session.orgId,
        reAuthenticationRequired: false,
        provider: oauthProvider,
        appSlug: session.appSlug,
        appCategory: session.appCategory,
        appRole: session.appRole,
        appType: session.appType,
        scope: session.scope,
        identifierEmail,
        ...integrationData,
    }) as IntegrationResource

    return { redirectAfter: session.redirectAfter ?? "/home" }
}