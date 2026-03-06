import { ContextProps } from "@snappin/features/trpc/_trpc"
import { TUpdateInvoiceTotal } from "./updateInvoiceTotal.schema"

export type UpdateInvoiceTotal = {
    ctx: ContextProps
    input: TUpdateInvoiceTotal
}

export async function updateInvoiceTotal({ ctx, input }: UpdateInvoiceTotal) {
    const { invoiceId, total } = input;

    await ctx.db.invoice.findOneAndUpdate({ _id: invoiceId }, { "invoice.total": total })
}