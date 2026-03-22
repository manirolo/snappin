import { ContextProps } from "@snappin/features/trpc/_trpc"
import { TUpdateVendor } from "./updateVendor.schema"
import { TRPCError } from "@trpc/server"
import { assertResourceAccess } from "../../lib/assertResourceAccess"

export type UpdateVendor = {
    ctx: ContextProps
    input: TUpdateVendor
}

export async function updateVendor({ ctx, input }: UpdateVendor): Promise<void | null> {
    await assertResourceAccess({
        userId: ctx.userId,
        orgId: ctx.orgId,
    })
    
    const invoice = await ctx.db.invoice
        .findOne({ _id: input.invoiceId, orgId: ctx.orgId })
        .lean()
    if (!invoice) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Invoice not found" })
    }
    const vendor = await ctx.db.vendor
        .findOne({ _id: input.newVendorId, orgId: ctx.orgId })
        .lean()

    if (!vendor) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Vendor not found" })
    }
    return await ctx.db.invoice.findOneAndUpdate({ _id: input.invoiceId }, { $set: { "invoice.vendorId": input.newVendorId } }, { returnDocument: "after" })
}