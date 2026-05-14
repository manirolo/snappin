import { StatusCodes } from "http-status-codes"
import { ContextProps } from "../../_trpc"
import type { TCreateNewOAuthSession, TCreateNewOAuthSessionResponse } from "./createOAuthSession.schema"
import { HttpError } from "@snappin/lib/http-error"
import * as arctic from "arctic"
import { AppRegistry, } from "@snappin/apps/appRegistry"
import { assertResourceAccess } from "../../lib/assertResourceAccess"
import { resolveProvider } from "@snappin/apps/lib/resolveProvider"
import { IntegrationUsageKey, UsageLimitError, UsageService } from "@snappin/features/billing/service/usage.service"
import { AppCategory } from "@snappin/shared/apps/app.schema"
import { TRPCError } from "@trpc/server"

export type CreateOAuthSession = {
    ctx: ContextProps
    input: TCreateNewOAuthSession
}

export async function createNewOAuthSession({ ctx, input }: CreateOAuthSession): Promise<TCreateNewOAuthSessionResponse> {
    if (!ctx.userId) {
        throw new HttpError({ statusCode: StatusCodes.UNAUTHORIZED, message: "User Id is invalid (Internal Server)" })
    }

    await assertResourceAccess({ userId: ctx.userId, orgId: ctx.orgId })

    const usageService = new UsageService()

    try {
        if (
            input.appCategory === AppCategory.STORAGE ||
            input.appCategory === AppCategory.ACCOUNTING
        ) {
            await usageService.assertIntegrationAllowed(
                ctx.orgId ?? "",
                input.appSlug as IntegrationUsageKey
            )
        }
        // WHATSAPP — no OAuth session, handled separately
        // COMMUNICATION — no limit check needed
    } catch (err) {
        if (err instanceof UsageLimitError) {
            throw new TRPCError({ code: "FORBIDDEN", message: err.displayMessage })
        }
        throw err
    }
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
        appRoles: input.appRoles,
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