import { TRPCError } from "@trpc/server"
import { ContextProps } from "../../_trpc"
import { assertResourceAccess } from "../../lib/assertResourceAccess"
import { GetInvoiceDataResponse, TGetInvoiceData } from "./getInvoiceData.schema"

export type GetInvoiceData = {
    ctx: ContextProps,
    input: TGetInvoiceData
}

export async function getInvoiceData({ ctx, input }: GetInvoiceData): Promise<GetInvoiceDataResponse | null> {
    await assertResourceAccess({ userId: ctx.userId, orgId: ctx.orgId })

    const invoice = await ctx.db.invoice
        .findOne({ _id: input.invoiceId })
        .populate("vendor")
        .populate({
            path: "extraction",
            populate: {
                path: "integration",
                select: "_id appType appSlug appCategory identifierEmail config reAuthenticationRequired createdAt status"
            },
        });

    if (!invoice) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Invoice not found" })
    }

    return invoice
}