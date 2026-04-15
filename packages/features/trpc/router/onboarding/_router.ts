import { createTRPCRouter, protectedProcedure } from "@snappin/features/trpc/_trpc";
import { onboardingStats, OnboardingStats } from "./onboardingStats.handler";

export const onboardingRouter = createTRPCRouter({
    connectedSrcCount: protectedProcedure.query(async (opts: OnboardingStats) => {
        return onboardingStats(opts)
    })
})