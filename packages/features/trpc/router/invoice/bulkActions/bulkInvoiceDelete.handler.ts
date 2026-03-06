import { ContextProps } from "@snappin/features/trpc/_trpc"
import { TBulkInvoiceDelete } from "./bulkInvoiceDelete.schema"
import { HttpError } from "@snappin/lib/http-error"
import { storageService } from "@snappin/infra/google/storage"

export type BulkInvoiceDelete = {
    ctx: ContextProps
    input: TBulkInvoiceDelete
}

export async function bulkInvoiceDelete({ ctx, input }: BulkInvoiceDelete) {

    for (const invoiceId of input.invoiceIds) {
        const invoice = await ctx.db.invoice.findOne({ _id: invoiceId }).populate("extraction");

        if (!invoice) {
            throw new HttpError({ statusCode: 404, message: "Invoice couldn't found" });
        }

        if (invoice?.extraction?._id) {
            await storageService.delete(invoice?.extraction?._id)
            await ctx.db.invoiceExtractionRequest.findOneAndDelete({ _id: invoice.extractionId })
        }

        await ctx.db.invoice.deleteOne({ _id: invoiceId })
    }
}