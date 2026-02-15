import { ContextProps } from "@snappin/trpc/_trpc"
import { VendorResource } from "@snappin/shared/invoice/vendor.schema"

export type VendorList = {
    ctx: ContextProps
}

export async function vendorList({ ctx }: VendorList): Promise<VendorResource[]> {
    return await ctx.db.vendor.find({ userId: ctx.userId, orgId: ctx.orgId })
}