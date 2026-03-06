import { ContextProps } from "../../_trpc"
import { GetQueryParamsResponse } from "./getQueryParams.schema"
import { getInvoiceFilterOptions } from "./utils/getInvoiceFilterOptions"

export type GetQueryParams = {
    ctx: ContextProps
}

export async function getQueryParams({ ctx }: GetQueryParams): Promise<GetQueryParamsResponse> {
    const [invoices, vendors] = await Promise.all([
        ctx.db.invoice.find({ userId: ctx.userId, orgId: ctx.orgId })
            .populate("vendor")
            .populate("extraction"),
        ctx.db.vendor.find({ userId: ctx.userId, orgId: ctx.orgId }),  
    ]);

    return getInvoiceFilterOptions(invoices, vendors); 
}