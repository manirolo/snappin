import { appRouter } from "@snappin/api/_root";
import { createContext } from "@snappin/api/_trpc";
import { env } from "@snappin/env";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    const url = new URL(req.url)

    const code = url.searchParams.get("code")
    const state = url.searchParams.get("state")

    if (!code || !state) {
        return NextResponse.redirect(`${env.app_url}/?error=invalid_oauth_callback`)
    }

    const ctx = await createContext({ req })
    const caller = appRouter.createCaller(ctx)

    try {
        const integration = await caller.integration.addIntegration({ code, state })
        return NextResponse.redirect(integration.redirectAfter)
    }
    catch (err) {
        console.error(err)
        return NextResponse.redirect(`${env.app_url}/integrations?error=invalid_oauth_callback`)
    }
}