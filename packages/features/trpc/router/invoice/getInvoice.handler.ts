import { paginate } from "@snappin/features/trpc/utils/paginated"
import { ContextProps } from "../../_trpc"
import { TGetInvoiceResponse, TGetInvoices } from "./getInvoice.schema"
import { PaginatedResponse } from "@snappin/shared/pagination"

export type GetInvoice = {
    ctx: ContextProps
    input: TGetInvoices
}

export async function getAllInvoices({ ctx, input }: GetInvoice): Promise<PaginatedResponse<TGetInvoiceResponse>> {

    const query: Record<string, unknown> = {
        userId: ctx.userId,
        orgId: ctx.orgId,
    };

    if (input.filters?.vendorIds?.length) {
        query["vendorId"] = { $in: input.filters.vendorIds };
    }

    // ✅ Direct query filters (no $lookup needed)
    if (input.filters?.currencies?.length) {
        query["currency"] = { $in: input.filters.currencies };
    }

    if (input.filters?.invoiceRecipients?.length) {
        query["recipient.name"] = {
            $in: input.filters.invoiceRecipients.map(
                (e) => new RegExp(e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")
            ),
        };
    }

    // Filters that require $lookup on extraction
    const extraMatch: Record<string, unknown> = {};

    if (input.filters?.senderEmails?.length) {
        extraMatch["extraction.source.metadata.from"] = {
            $in: input.filters.senderEmails.map(
                (e) => new RegExp(e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")
            ),
        };
    }

    if (input.filters?.recipientEmails?.length) {
        extraMatch["extraction.source.metadata.to"] = {
            $in: input.filters.recipientEmails.map(
                (e) => new RegExp(e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")
            ),
        };
    }

    return await paginate({
        model: ctx.db.invoice,
        query,
        extraMatch: Object.keys(extraMatch).length ? extraMatch : undefined,
        page: input.page,
        limit: input.limit,
        select: "_id userId orgId invoiceId invoiceDate dueDate payment tax total recipient updatedAt createdAt",
        populate: [
            "vendor",
            {
                path: "extraction",
                select: "source documentId thumbnail integration",
                populate: {
                    path: "integration",
                    select: "_id appType appSlug appCategory identifierEmail config reAuthenticationRequired createdAt status",
                }
            }
        ],

        sort: { createdAt: -1 },
    });
}