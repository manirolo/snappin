import { paginate } from "@snappin/trpc/utils/paginated"
import { ContextProps } from "../../_trpc"
import { TGetInvoiceResponse, TGetInvoices } from "./getInvoice.schema"
import { PaginatedResponse } from "@snappin/shared/pagination"

export type GetInvoice = {
    ctx: ContextProps
    input: TGetInvoices
}

export async function getAllInvoices({ ctx, input }: GetInvoice): Promise<PaginatedResponse<TGetInvoiceResponse>> {

    return await paginate({
        model: ctx.db.invoice,
        query: {
            userId: ctx.userId,
            orgId: ctx.orgId,
        },
        page: input.page,
        limit: input.limit,
        select:
            "_id userId orgId invoice extraction attachmentId source isInvoice isRefund updatedAt createdAt",
        populate: "vendorDoc",
        sort: { createdAt: -1 },
    });
}