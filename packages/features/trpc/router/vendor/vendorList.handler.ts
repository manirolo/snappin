import { ContextProps } from "@snappin/features/trpc/_trpc"
import { VendorResource } from "@snappin/shared/vendor/vendor.schema"
import { assertResourceAccess } from "../../lib/assertResourceAccess"

export type VendorList = {
    ctx: ContextProps
}

export async function vendorList({ ctx }: VendorList): Promise<VendorResource[]> {
    await assertResourceAccess({ userId: ctx.userId, orgId: ctx.orgId })
    return await ctx.db.vendor.find({ userId: ctx.userId, orgId: ctx.orgId })
}