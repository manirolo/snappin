import { UsageService } from "@snappin/features/billing/service/usage.service"
import { ContextProps } from "../../_trpc"
import { TRPCError } from "@trpc/server"

export type Usage = {
    ctx: ContextProps
}

export async function usage({ ctx }: Usage) {
    const usageService = new UsageService()

    if(!ctx.orgId) throw new TRPCError({ code: "UNAUTHORIZED", message: "You're not belong to any of the organization"})
        
    return usageService.getUsageSummary(ctx.orgId)
}