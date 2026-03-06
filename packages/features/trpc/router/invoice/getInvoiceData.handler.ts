import { ContextProps } from "../../_trpc"
import { GetInvoiceDataResponse, TGetInvoiceData } from "./getInvoiceData.schema"

export type GetInvoiceData = {
    ctx: ContextProps,
    input: TGetInvoiceData
}

export async function getInvoiceData({ ctx, input }: GetInvoiceData): Promise<GetInvoiceDataResponse | null> {
    return await ctx.db.invoice
        .findOne({ _id: input.invoiceId })
        .populate("vendor")
        .populate({
            path: "extraction",
            populate: {
                path: "integration",
                select: "_id appType appSlug appCategory identifierEmail config reAuthenticationRequired createdAt status"
            },
        });
}