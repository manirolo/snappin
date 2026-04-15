import { ContextProps } from "@snappin/features/trpc/_trpc"
import { TBulkInvoiceDelete } from "./bulkInvoiceDelete.schema"
import { storageService } from "@snappin/infra/google/storage"
import { assertResourceAccess } from "@snappin/features/trpc/lib/assertResourceAccess"
import { TRPCError } from "@trpc/server"

export type BulkInvoiceDelete = {
    ctx: ContextProps
    input: TBulkInvoiceDelete
}

export async function bulkInvoiceDelete({ ctx, input }: BulkInvoiceDelete) {

    const invoices = await ctx.db.invoice.find({ _id: { $in: input.invoiceIds } }).populate("extraction").lean()

    const foundIds = new Set(invoices.map((inv) => inv._id.toString()))
    const missingIds = input.invoiceIds.filter((id) => !foundIds.has(id))

    if (missingIds.length > 0) {
        throw new TRPCError({
            code: "NOT_FOUND",
            message: `Some of selected invoices not found`,
        })
    }
    const { role } = await assertResourceAccess({ userId: ctx.userId, orgId: ctx.orgId })
    const isAdmin = role === "org:admin"

    if (!isAdmin) {
        const unauthorized = invoices.filter((inv) => inv.userId.toString() !== ctx.userId)
        if (unauthorized.length > 0) {
            throw new TRPCError({
                code: "FORBIDDEN",
                message: `You do not have permission to delete ${unauthorized.length} invoice(s)`,
            })
        }
    }

    const extractionIds = invoices
        .flatMap((inv) => inv.extraction?._id ? [inv.extraction._id] : [])

    const invoiceExtractionIds = invoices
        .flatMap((inv) => inv.extractionId ? [inv.extractionId] : [])

    await Promise.all([
        // Delete files from storage
        ...extractionIds.map((id) => storageService.delete(id)),
        // Bulk delete extraction requests
        ctx.db.invoiceExtractionRequest.deleteMany({ _id: { $in: invoiceExtractionIds } }),
        // Bulk delete invoices
        ctx.db.invoice.deleteMany({ _id: { $in: input.invoiceIds } }),
    ])
}