import { StatusCodes } from "http-status-codes"
import { ContextProps } from "../../_trpc"
import type { TCreateNewOAuthSession, TCreateNewOAuthSessionResponse } from "./createOAuthSession.schema"
import { HttpError } from "@snappin/lib/http-error"
import * as arctic from "arctic"
import { AppRegistry, } from "@snappin/apps/appRegistry"
import { assertResourceAccess } from "../../lib/assertResourceAccess"
import { resolveProvider } from "@snappin/apps/lib/resolveProvider"

export type CreateOAuthSession = {
    ctx: ContextProps
    input: TCreateNewOAuthSession
}

export async function createNewOAuthSession({ ctx, input }: CreateOAuthSession): Promise<TCreateNewOAuthSessionResponse> {
    if (!ctx.userId) {
        throw new HttpError({ statusCode: StatusCodes.UNAUTHORIZED, message: "User Id is invalid (Internal Server)" })
    }

    await assertResourceAccess({ userId: ctx.userId, orgId: ctx.orgId })

    // Resolve the app provider from the registry
    const app = resolveProvider(input.appCategory, input.appSlug)

    // CSRF protection — correlates request to callback
    const state = arctic.generateState()

    // PKCE — secret used for secure code exchange
    const codeVerifier = arctic.generateCodeVerifier()

    // ─── Re-auth resolution ───────────────────────────────────────────────────
    const reAuthenticateIntegrationId = input.reAuthenticate?.integrationId || null
    const reAuthenticateSession = !!reAuthenticateIntegrationId

    // ─── Persist OAuth session (TTL handled by MongoDB, ~60s interval) ────────
    await ctx.db.oauthSession.create({
        userId: ctx.userId,
        orgId: ctx.orgId,
        state,
        appSlug: input.appSlug,
        appCategory: input.appCategory,
        appType: input.appType,
        appRole: input.appRole,
        scope: AppRegistry[input.appSlug as keyof typeof AppRegistry].config.permissions,
        codeVerifier,
        redirectAfter: input.redirectAfter,
        ...(reAuthenticateSession && {
            reAuthenticateSession: true,
            reAuthenticate: { integrationId: reAuthenticateIntegrationId },
        }),
    })

    // ─── Login hint for re-auth (pre-selects account in OAuth consent) ────────
    let loginHint: string | undefined

    if (reAuthenticateSession && reAuthenticateIntegrationId) {
        const integration = await ctx.db.integration
            .findOne({ _id: reAuthenticateIntegrationId, userId: ctx.userId, orgId: ctx.orgId ?? null })
            .select("identifierEmail")
            .lean()

        if (integration?.identifierEmail) {
            loginHint = integration.identifierEmail
        }
    }

    // ─── Generate OAuth redirect URL ──────────────────────────────────────────
    const data = await app.generateSessionUrl({
        state,
        codeVerifier,
        ...(loginHint && { loginHint }),
    })

    return { redirectUrl: data?.session.url ?? "" }
}