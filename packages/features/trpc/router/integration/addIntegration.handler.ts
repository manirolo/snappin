import { ContextProps } from "../../_trpc"
import { TAddIntegration, TAddIntegrationResponse } from "./addIntegration.schema"
import { OAuthSessionResource } from "@snappin/shared/auth/oauthSession.schema"
import { TRPCError } from "@trpc/server"
import { assertResourceAccess } from "../../lib/assertResourceAccess"
import { categoryHandlers } from "./lib/categoryHandler"

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

    const handler = categoryHandlers[session.appCategory]

    if (!handler) {
        return { redirectAfter: "/connection-failed" }
    }

    return handler({ ctx, input, session })
}