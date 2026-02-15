import { paginate } from "@snappin/trpc/utils/paginated"
import { ContextProps } from "../../_trpc"
import { GetIntegrationResponse, TGetIntegration } from "./getIntegration.schema"
import { PaginatedResponse } from "@snappin/shared/pagination"

export type GetIntegration = {
    ctx: ContextProps,
    input: TGetIntegration
}

export async function getIntegration({ ctx, input }: GetIntegration): Promise<PaginatedResponse<GetIntegrationResponse>> {
    return await paginate({
        model: ctx.db.integration,
        query: {
            userId: ctx.userId,
            orgId: ctx.orgId,
        },
        page: input.page,
        limit: input.limit,
        select: "_id appType appSlug appCategory identifierEmail mailMonitored reAuthenticationRequired status",
        sort: { createdAt: -1 },
    });
}