import { ContextProps } from "@snappin/features/trpc/_trpc"
import { AppType } from "@snappin/shared/apps/app.schema"
import { OnboardingStatsResponse } from "./onboardingStats.schema"
import { clerk } from "@snappin/features/trpc/config/clerk"

export type OnboardingStats = {
    ctx: ContextProps
}

export async function onboardingStats({ ctx }: OnboardingStats): Promise<OnboardingStatsResponse> {
    /**
     *  Need to send following 
     * 
     * {
     *  connectedSrcCount: 1
     * }
     *
     *  */
    if(!ctx.userId) return { connectedSrcCount: 0 }
    const tokenResponse = await clerk.users.getUserOauthAccessToken(ctx.userId, 'google');

    console.log(tokenResponse)

    const sourceCount = await ctx.db.integration.find({ userId: ctx.userId, appType: AppType.SOURCE }).lean()

    return { connectedSrcCount: sourceCount.length }
}