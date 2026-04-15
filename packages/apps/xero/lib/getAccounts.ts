import { GetAccountsResponse } from "../../appRegistry.interface";
import { xero } from "../xero.client";
import { AccountType } from "xero-node";

export async function getAccounts({
    accessToken,
    tenantId,
}: {
    accessToken: string;
    tenantId: string;
}): Promise<GetAccountsResponse> {
    await xero.initialize();
    xero.setTokenSet({ access_token: accessToken ?? undefined });

    const response = await xero.accountingApi.getAccounts(
        tenantId,
        undefined,
        // ✅ Only fetch expense/revenue accounts — relevant for bill line items
        `Type=="${AccountType.EXPENSE}" OR Type=="${AccountType.REVENUE}" OR Type=="${AccountType.DIRECTCOSTS}"`,
    );

    const accounts = response.body?.accounts ?? [];

    return {
        accounts: accounts
            .filter(acc => acc.accountID && acc.name && !acc.systemAccount) // exclude system accounts
            .map(acc => ({
                label: acc.code
                    ? `${acc.code} - ${acc.name}`  
                    : acc.name ?? "",
                value: acc.accountID ?? "",
                code: acc.code ?? null,
                type: acc.type ? String(acc.type) : null,
            })),
    };
}