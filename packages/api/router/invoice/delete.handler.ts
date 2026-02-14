import { HttpError } from "@snappin/lib/http-error"
import { ContextProps } from "../../_trpc"
import { TDeleteInvoice } from "./delete.schema"

export type DeleteInvoice = {
    ctx: ContextProps
    input: TDeleteInvoice
}

export const deleteInvoice = async ({ ctx, input }: DeleteInvoice): Promise<void> => {
    const deleteItem = await ctx.db.invoice.findOne({ _id: input.invoiceId })

    if(!deleteItem){
        throw new HttpError({ statusCode: 404, message: "Invoice couldn't found"})
    }

    await ctx.db.invoice.deleteOne({ _id: input.invoiceId })
}