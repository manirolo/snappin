import { AppType } from "@snappin/shared/apps/app.schema"
import { ContextProps } from "../../_trpc"
import { TRPCError } from "@trpc/server";

export type GetExportIntegrations = {
    ctx: ContextProps
}

export async function getExportIntegrations({ ctx }: GetExportIntegrations) {
    if (!ctx.orgId) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Organization required" });
    }
    return await ctx.db.integration.find({ orgId: ctx.orgId, appType: AppType.DESTINATION }).lean().select("_id appSlug appCategory appType identifierEmail metadata.orgName")
}