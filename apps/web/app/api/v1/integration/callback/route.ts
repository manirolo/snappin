import { NextRequest, NextResponse } from "next/server";
import { appRouter } from "@snappin/features/trpc/_root";
import { createContext } from "@snappin/features/trpc/_trpc";
import { env } from "@snappin/env";

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get("code");
    const state = request.nextUrl.searchParams.get("state");

    if (!code || !state) {
        return NextResponse.redirect(
            `${env.app_url}/integrations?error=invalid_oauth_callback`
        );
    }

    try {
        const ctx = await createContext({ req: request });
        const caller = appRouter.createCaller(ctx);

        const integration = await caller.integration.addIntegration({
            code,
            state,
            callbackUrl: request.url,
        });

        return NextResponse.redirect(
            integration.redirectAfter ?? `${env.app_url}/dashboard`
        );
    } catch (err) {
        console.error(err);

        return NextResponse.redirect(`${env.app_url}/connection-failed`);
    }
}