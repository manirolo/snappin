import { paginate } from "@snappin/features/trpc/utils/paginated"
import { ContextProps } from "../../_trpc"
import { TGetInvoiceResponse, TGetInvoices } from "./getInvoice.schema"
import { PaginatedResponse } from "@snappin/shared/pagination"
import { assertResourceAccess } from "../../lib/assertResourceAccess"
import { buildInvoiceQuery } from "./utils/buildInvoiceQuery"

export type GetInvoice = {
    ctx: ContextProps
    input: TGetInvoices
}

export async function getAllInvoices({ ctx, input }: GetInvoice): Promise<PaginatedResponse<TGetInvoiceResponse>> {
    await assertResourceAccess({ userId: ctx.userId, orgId: ctx.orgId })

    const { query, extraMatch } = buildInvoiceQuery(ctx, input.filters);

    return await paginate({
        model: ctx.db.invoice,
        query,
        extraMatch: extraMatch ?? undefined,
        page: input.page,
        limit: input.limit,
        select: "_id userId orgId invoiceDate description currency totals vendorId extractionId integrations metadata updatedAt createdAt",
        populate: [
            {
                path: "vendor",
                select: "name"
            },
            {
                path: "extraction",
                select: "source.kind _integration source.metadata",
            }
        ],

        sort: { createdAt: -1 },
    });
}