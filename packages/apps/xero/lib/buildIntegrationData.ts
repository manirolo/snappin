import { SnappinError } from "@snappin/lib/error/snappin.error";
import { BuildAccountingIntegrationData, BuildAccountingIntegrationDataResponse } from "../../appRegistry.interface";
import { xero } from "../xero.client";

export async function buildIntegrationData({
    accessToken,
    refreshToken,
    accessTokenExpiresAt,
}: BuildAccountingIntegrationData): Promise<BuildAccountingIntegrationDataResponse> {

    if (!accessToken) {
        throw new SnappinError("Access token is required to build Xero integration data", "invalid_integration_request");
    }
    await xero.initialize();
    xero.setTokenSet({ access_token: accessToken });
    const tenants = await xero.updateTenants(true);
    const tenant = tenants?.[0];

    // Get the connected Xero tenant (org) for this token
    const tenantId = tenant?.tenantId ?? null;
    const orgName = tenant?.orgData?.name ?? null;

    return {
        accessToken,
        accessTokenExpiresAt,
        refreshToken,
        config: {
            tenantId,
            orgName
        },
    };
}