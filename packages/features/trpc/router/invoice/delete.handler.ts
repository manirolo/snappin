import { ContextProps } from "../../_trpc"
import { assertResourceAccess } from "../../lib/assertResourceAccess"
import { TDeleteInvoice } from "./delete.schema"
import { storageService } from "@snappin/infra/google/storage"
import { TRPCError } from "@trpc/server"
export type DeleteInvoice = {
    ctx: ContextProps
    input: TDeleteInvoice
}

export const deleteInvoice = async ({ ctx, input }: DeleteInvoice): Promise<void> => {
    const invoice = await ctx.db.invoice.findOne({ _id: input.invoiceId }).populate("extraction");

    if (!invoice) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Invoice couldn't found" });
    }
    await assertResourceAccess({
        userId: ctx.userId,
        orgId: ctx.orgId,
        resourceOwnerId: invoice.userId.toString(),
    })

    await Promise.all([
        invoice.extraction?.documentId
            ? storageService.delete(invoice.extraction.documentId)
            : Promise.resolve(),
        invoice.extractionId
            ? ctx.db.invoiceExtractionRequest.deleteOne({ _id: invoice.extractionId })
            : Promise.resolve(),
        ctx.db.invoice.deleteOne({ _id: input.invoiceId }),
    ])
}