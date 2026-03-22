import { SnappinError } from "@snappin/lib/error/snappin.error";
import { ExchangeCodeForTokensProps, ExchangeCodeForTokensResponse } from "../../appRegistry.interface";
import { XeroClient } from "xero-node";
import { xeroConfigData } from "../xero.config";

export async function exchangeCodeForTokens(payload: ExchangeCodeForTokensProps): Promise<ExchangeCodeForTokensResponse> {

    if (!payload.code || !payload.callbackUrl || !payload.state) {
        throw new SnappinError("Authentication failed", "invalid_integration_request");
    }
    const xeroPerRequest = new XeroClient({
        clientId: xeroConfigData.clientId,
        clientSecret: xeroConfigData.clientSecret,
        redirectUris: [xeroConfigData.callbackUrl],
        scopes: xeroConfigData.permissions,
        state: payload.state, // ✅ must match what Xero sends back in callback
        httpTimeout: 12000,
    });

    await xeroPerRequest.initialize();

    const callbackUrl = payload.callbackUrl;

    // xero-node handles the token exchange internally
    const tokenSet = await xeroPerRequest.apiCallback(callbackUrl); // full callback URL with code + state

    const accessToken = tokenSet.access_token;
    const refreshToken = tokenSet.refresh_token;
    const accessTokenExpiresAt = tokenSet.expires_at
        ? String(new Date(tokenSet.expires_at * 1000).toISOString())
        : null;

    if (!accessToken || !refreshToken || !accessTokenExpiresAt) {
        throw new SnappinError("Xero token exchange failed", "invalid_integration_request");
    }

    return { accessToken, refreshToken, accessTokenExpiresAt };
}