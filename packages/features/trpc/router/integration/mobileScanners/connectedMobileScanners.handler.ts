import { ContextProps } from "@snappin/features/trpc/_trpc"
import { paginate } from "@snappin/features/trpc/utils/paginated";
import { TGetIntegration } from "../getIntegration.schema";
import { PaginatedResponse } from "@snappin/shared/pagination";
import { ConnectedMobileScannersResponse } from "./connectedMobileScanners.schema";
import { AppRole } from "@snappin/shared/apps/app.schema";

export type ConnectedMobileScanners = {
    ctx: ContextProps,
    input: TGetIntegration
}

export async function connectedMobileScanners({ ctx, input }: ConnectedMobileScanners): Promise<PaginatedResponse<ConnectedMobileScannersResponse>> {
    return await paginate({
        model: ctx.db.integration,
        query: {
            userId: ctx.userId,
            orgId: ctx.orgId,
            appRole: AppRole.MOBILE_SCANNER
        },
        page: input.page,
        limit: input.limit,
        select: "_id appType appSlug appCategory appRole config reAuthenticationRequired status",
        sort: { createdAt: -1 },
    });
}