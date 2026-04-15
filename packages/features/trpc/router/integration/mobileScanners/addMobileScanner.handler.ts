import { ContextProps } from "@snappin/features/trpc/_trpc"
import { TAddMobileScanner } from "./addMobileScanner.schema"
import { assertResourceAccess } from "@snappin/features/trpc/lib/assertResourceAccess"
import { appMetadata } from "@snappin/apps/app.metadata"
import { AppSlug } from "@snappin/shared/apps/app.schema"
import { TRPCError } from "@trpc/server"
import { UsageLimitError, UsageService } from "@snappin/features/billing/service/usage.service"

export type AddMobileScanner = {
    ctx: ContextProps,
    input: TAddMobileScanner
}

export async function addMobileScanner({ ctx, input }: AddMobileScanner) {
    await assertResourceAccess({ userId: ctx.userId, orgId: ctx.orgId })

    if (!ctx.userId || !ctx.orgId) throw new TRPCError({ code: "UNAUTHORIZED" })

    const existMobileScanner = await ctx.db.integration.findOne({ "metadata.phone": input.phone })

    if (existMobileScanner) {
        throw new TRPCError({ code: "CONFLICT", message: "Mobil scanner already exist" })
    }
    const usageService = new UsageService()

    try {
        await usageService.assertWithinLimit(ctx.orgId ?? "", "mobileScanners")
    } catch (err) {
        if (err instanceof UsageLimitError) {
            throw new TRPCError({ code: "FORBIDDEN", message: err.displayMessage })
        }
        throw err
    }

    const app = appMetadata[AppSlug.WHATSAPP]
    try {
        await ctx.db.integration.create({
            userId: ctx.userId,
            orgId: ctx.orgId,

            appSlug: app.slug,
            appCategory: app.category,
            appRoles: app.role,
            appType: app.type,

            metadata: {
                phone: input.phone
            }
        })

        await usageService.increment(ctx.orgId, "mobileScanners")
    } catch (err) {
        console.error(err)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Something went wrong" })
    }
}