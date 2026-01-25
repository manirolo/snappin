import { StatusCodes } from "http-status-codes"
import { ContextProps } from "../../_trpc"
import type { TCreateNewOAuthSession, TCreateNewOAuthSessionResponse } from "./createOAuthSession.schema"
import { HttpError } from "@snappin/lib/http-error"
import * as arctic from "arctic"
import { env } from "@snappin/env"
import { EmailAppsStore } from "@snappin/apps/appRegistry"
import { EmailApps } from "@snappin/apps/appRegistry.interface"
import { AppCategory } from "@snappin/shared/apps/app.enum"

type CreateOAuthSession = {
    ctx: ContextProps,
    input: TCreateNewOAuthSession
}

export async function createNewOAuthSession({ ctx, input }: CreateOAuthSession): Promise<TCreateNewOAuthSessionResponse> {
    if (!ctx.userId) throw new HttpError({ statusCode: StatusCodes.UNAUTHORIZED, message: "User Id is invalid (Internal Server)" })


    if (input.appCategory == AppCategory.EMAIL) {
        
        // CSRF Protection 
        // Correlating request to callback 
        const state = arctic.generateState()

        // A secret key generated for secure code exchange
        // NOTE: I don't know how codeVerifier generates code and verifies it. 
        const codeVerifier = arctic.generateCodeVerifier();

        // Session valid for 5 minutes only
        // Set expiresAt to allow mongodb enable TTL to delete
        // Delete is handled by mongodb. Delete triggered every 60sec (Not sure about interval) 
        await ctx.db.oauthSession.create({
            userId: ctx.userId,
            orgId: ctx.orgId,
            state,
            appSlug: input.appSlug,
            appCategory: input.appCategory,
            codeVerifier,
            redirectAfter: input.redirectAfter
        })

        const app = EmailAppsStore[input.appSlug] as EmailApps

        const data = await app.generateSessionUrl({ state, codeVerifier });

        return { redirectUrl: data?.session.url ?? "" }
    } else {
        throw new HttpError({ statusCode: StatusCodes.NOT_IMPLEMENTED, message: `Integration app ${input.appSlug} not implemented or not available` })
    }
}