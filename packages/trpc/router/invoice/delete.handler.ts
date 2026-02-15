import { HttpError } from "@snappin/lib/http-error"
import { ContextProps } from "../../_trpc"
import { TDeleteInvoice } from "./delete.schema"
import { deleteFile } from "@snappin/infra/google/storage"

export type DeleteInvoice = {
    ctx: ContextProps
    input: TDeleteInvoice
}

export const deleteInvoice = async ({ ctx, input }: DeleteInvoice): Promise<void> => {
    const invoice = await ctx.db.invoice.findOne({ _id: input.invoiceId });

    if (!invoice) {
        throw new HttpError({ statusCode: 404, message: "Invoice couldn't found" });
    }

    if (invoice.attachmentId) {
        await deleteFile(invoice.attachmentId)
    }
    
    await ctx.db.invoice.deleteOne({ _id: input.invoiceId })
}