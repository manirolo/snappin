import { TRPCError } from "@trpc/server";
import { ContextProps } from "../../_trpc";
import { TGetAccounts } from "./getAccounts.schema";
import { AppCategory } from "@snappin/shared/apps/app.schema";
import { AnyAccountingProvider, resolveProvider } from "@snappin/apps/lib/resolveProvider";
import { XeroIntegration } from "@snappin/shared/integration/integration.schema";

export type GetAccounts = {
    ctx: ContextProps;
    input: TGetAccounts;
};

export async function getAccounts({ ctx, input }: GetAccounts) {
    const integration = await ctx.db.integration.findOne({ _id: input.integrationId }) as XeroIntegration;

    if (!integration || !integration.appSlug || !integration.appCategory) {
        throw new TRPCError({ message: "Integration not found", code: "NOT_FOUND" });
    }

    if (integration.appCategory !== AppCategory.ACCOUNTING) {
        throw new TRPCError({ message: "Selected integration is not an accounting provider", code: "BAD_REQUEST" });
    }

    if (!integration.config?.tenantId) {
        throw new TRPCError({ message: "Accounting organization is not configured", code: "PRECONDITION_FAILED" });
    }

    const provider = resolveProvider(integration.appCategory, integration.appSlug) as AnyAccountingProvider;

    const { accessToken } = await provider.getAccessToken({ integration });
    
    try {
        const result = await provider.getAccounts({
            accessToken,
            tenantId: integration.config.tenantId,
        });

        return result; // { accounts: AccountOption[] }

    } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("[getAccounts] unexpected error:", error);
        throw new TRPCError({
            message: "Failed to fetch accounts from accounting provider",
            code: "INTERNAL_SERVER_ERROR",
            cause: error,
        });
    }
}