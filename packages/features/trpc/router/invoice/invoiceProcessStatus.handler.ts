import { ContextProps } from "../../_trpc"
import { assertResourceAccess } from "../../lib/assertResourceAccess"
import { TInvoiceProcessStatusResponse } from "./invoiceProcessStatus.schema"

export type InvoiceProcessStatus = {
    ctx: ContextProps
}

export async function invoiceProcessingStatus({ ctx }: InvoiceProcessStatus): Promise<TInvoiceProcessStatusResponse> {

    await assertResourceAccess({ userId: ctx.userId, orgId: ctx.orgId })
    
    const docs = await ctx.db.invoiceExtractionRequest.find({
        userId: ctx.userId,
        orgId: ctx.orgId,
        status: { $in: ["queued", "processing", "success"] }
    })

    const statusCounts = docs.reduce((acc, doc) => {
        acc[doc.status] = (acc[doc.status] ?? 0) + 1
        return acc
    }, {} as Record<string, number>)

    const total = docs.length
    const done = total > 0 && docs.every(d => d.status === 'success')

    return { total, done, statusCounts }
}