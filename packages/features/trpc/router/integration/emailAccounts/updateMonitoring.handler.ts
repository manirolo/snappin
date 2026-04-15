import { IntegrationResource } from "@snappin/shared/integration/integration.schema"
import { ContextProps } from "../../../_trpc"
import { TUpdateMonitoringIntegration } from "./updateMonitoring.schema"
import { AppRole, EmailAppSlug } from "@snappin/shared/apps/app.schema";
import { EmailAppsStore } from "@snappin/apps/appRegistry"
import { TRPCError } from "@trpc/server"
import { assertResourceAccess } from "../../../lib/assertResourceAccess";
import { UsageLimitError, UsageService } from "@snappin/features/billing/service/usage.service";
import { IntegrationStatus } from "@snappin/shared/integration/status.enum";

export type UpdateMonitoringIntegration = {
    ctx: ContextProps
    input: TUpdateMonitoringIntegration
}

export async function updateMonitoringIntegration({ ctx, input }: UpdateMonitoringIntegration): Promise<IntegrationResource | null> {
    const integration = await ctx.db.integration.findOne({ _id: input.integrationId, orgId: ctx?.orgId, appRoles: [AppRole.EMAIL_SOURCE] })

    if (!integration) throw new TRPCError({ code: "NOT_FOUND", message: "Integration not found" })

    await assertResourceAccess({ userId: ctx.userId, orgId: ctx.orgId, resourceOwnerId: integration?.userId })

    const provider = EmailAppsStore[integration.appSlug as EmailAppSlug]

    if (!provider) throw new TRPCError({ code: "BAD_REQUEST", message: "Unsupported app provider" })

    let status: IntegrationStatus = IntegrationStatus.CONNECTED

    try {
        if (!input.disable) {
            try {
                const usageService = new UsageService()
                await usageService.assertEmailAccountAllowed(integration.orgId)
                await provider.startWatching({ integration })
                status = IntegrationStatus.CONNECTED
            } catch (error) {
                if (error instanceof UsageLimitError) {
                    // Plan limit hit — mark as paused, don't start watching
                    status = IntegrationStatus.PAUSED
                    console.warn(`[updateMonitoring] Usage limit reached for org ${integration.orgId}:`, error.displayMessage);
                    throw new TRPCError({
                        code: "FORBIDDEN",
                        message: error.displayMessage,
                    })
                } else {
                    // Provider watch failed — still connected but monitoring off
                    status = IntegrationStatus.ERROR
                    console.warn(`[updateMonitoring] startWatching failed for ${integration.appSlug}:`, error)

                }
            }
        } else {
            try {
                await provider.stopWatching({ integration })
                status = IntegrationStatus.PAUSED
            } catch (error) {
                status = IntegrationStatus.PAUSED  // still mark as paused even if stopWatching fails
                console.warn(`[updateMonitoring] stopWatching failed for ${integration.appSlug}:`, error)
            }
    }

    } catch (error) {
    if (error instanceof TRPCError) throw error  // preserve original message
    console.warn(`[updateMonitoring] watch operation failed for ${integration.appSlug}:`, error)
    throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong",
    })
}

return await ctx.db.integration.findOneAndUpdate(
    { _id: input.integrationId, orgId: ctx.orgId, appRoles: [AppRole.EMAIL_SOURCE] },
    { status },
    { returnDocument: "after" }
).select("status")
}