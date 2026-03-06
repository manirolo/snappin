import { ContextProps } from "@snappin/features/trpc/_trpc"
import { TUpdateVendor } from "./updateVendor.schema"

export type UpdateVendor = {
    ctx: ContextProps
    input: TUpdateVendor
}

export async function updateVendor({ ctx, input }: UpdateVendor): Promise<void | null> {
    return await ctx.db.invoice.findOneAndUpdate({ _id: input.invoiceId }, { $set: { "invoice.vendorId": input.newVendorId } }, { new: true })
}