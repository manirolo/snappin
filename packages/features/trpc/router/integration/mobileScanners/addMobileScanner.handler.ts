import { ContextProps } from "@snappin/features/trpc/_trpc"
import { TAddMobileScanner } from "./addMobileScanner.schema"
import { assertResourceAccess } from "@snappin/features/trpc/lib/assertResourceAccess"
import { appMetadata } from "@snappin/apps/app.metadata"
import { AppSlug } from "@snappin/shared/apps/app.schema"
import { TRPCError } from "@trpc/server"

export type AddMobileScanner = {
    ctx: ContextProps,
    input: TAddMobileScanner
}

export async function addMobileScanner({ ctx, input }: AddMobileScanner) {
    await assertResourceAccess({ userId: ctx.userId, orgId: ctx.orgId })

    if (!ctx.userId || !ctx.orgId) throw new TRPCError({ code: "UNAUTHORIZED" })

    const app = appMetadata[AppSlug.WHATSAPP]
    await ctx.db.integration.create({
        userId: ctx.userId,
        orgId: ctx.orgId,

        appSlug: app.slug,
        appCategory: app.category,
        appRole: app.role,
        appType: app.type,

        config: {
            phone: input.phone
        }
    })
}