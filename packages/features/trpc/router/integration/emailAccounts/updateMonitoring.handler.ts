import { IntegrationResource } from "@snappin/shared/integration/integration.schema"
import { ContextProps } from "../../../_trpc"
import { TUpdateMonitoringIntegration } from "./updateMonitoring.schema"
import { AppRole, EmailAppSlug } from "@snappin/shared/apps/app.schema";
import { EmailAppsStore } from "@snappin/apps/appRegistry"
import { TRPCError } from "@trpc/server"

export type UpdateMonitoringIntegration = {
    ctx: ContextProps
    input: TUpdateMonitoringIntegration
}

export async function updateMonitoringIntegration({ ctx, input }: UpdateMonitoringIntegration): Promise<IntegrationResource | null> {
    const integration = await ctx.db.integration.findOne({ _id: input.integrationId, appRole: AppRole.EMAIL_SOURCE })

    if (!integration) throw new TRPCError({ code: "NOT_FOUND", message: "Integration not found" })

    const provider = EmailAppsStore[integration.appSlug as EmailAppSlug]

    if (!provider) throw new TRPCError({ code: "BAD_REQUEST", message: "Unsupported app provider" })

    let watchConfig: Record<string, unknown> = {
        "mailMonitored": input.mailMonitored,
    }
    try {
        if (input.mailMonitored) {
            const watch = await provider.startWatching({ integration })
            
            watchConfig = watch
            watchConfig["mailMonitored"] = input.mailMonitored
        } else {
            await provider.stopWatching({ integration })
            watchConfig["mailMonitored"] = input.mailMonitored
        }
    } catch (error) {
        // Graph subscription may not exist yet — safe to ignore, just update the DB flag
        console.warn(`[updateMonitoring] watch operation failed for ${integration.appSlug}:`, error)
    }

    return await ctx.db.integration.findOneAndUpdate(
        { _id: input.integrationId, appRole: AppRole.EMAIL_SOURCE },
        { config: watchConfig },
        { new: true }
    )
}