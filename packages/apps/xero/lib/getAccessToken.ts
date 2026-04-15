import { logger } from "@snappin/lib/logger";
import { RetrieveAccessToken, RetrieveAccessTokenResponse } from "../../appRegistry.interface";
import { xero } from "../xero.client";
import { compareAndSaveIfNewToken } from "../../utils/compareAndSaveIfNewToken";
import { markReAuthenticationRequired } from "../../utils/markReAuthenticationRequired";

export async function getAccessToken({ integration }: RetrieveAccessToken): Promise<RetrieveAccessTokenResponse> {
    const REFRESH_BUFFER_MS = 60 * 1000;

    const expiresAt = integration.accessTokenExpiresAt
        ? new Date(integration.accessTokenExpiresAt).getTime()
        : null;

    const isExpired = !expiresAt || expiresAt - REFRESH_BUFFER_MS <= Date.now();

    // Token still valid — reuse it
    if (!isExpired && integration.accessToken) {
        return { accessToken: integration.accessToken };
    }

    if (!integration.refreshToken) {
        throw new Error("Refresh token missing. Re-authentication required.");
    }

    try {
        await xero.initialize();
        // Set the existing token on the client so it can refresh
        xero.setTokenSet({
            access_token: integration.accessToken ?? undefined,
            refresh_token: integration.refreshToken,
        });

        const newTokenSet = await xero.refreshToken();

        const newAccessToken = newTokenSet.access_token;
        const newAccessTokenExpiresAt = newTokenSet.expires_at
            ? String(new Date(newTokenSet.expires_at * 1000))
            : null;

        if (!newAccessToken) {
            throw new Error("Xero refresh returned empty access token");
        }

        await compareAndSaveIfNewToken({
            integration,
            accessTokenFromFn: newAccessToken,
            accessTokenExpiresAtFromFn: newAccessTokenExpiresAt,
        });

        return { accessToken: newAccessToken };

    } catch (error) {
        logger.error("Failed to refresh Xero access token", error);

        const isInvalidGrant =
            error instanceof Error &&
            (error.message.includes("invalid_grant") || error.message.includes("token_rejected"));

        if (isInvalidGrant && integration._id) {
            logger.warn("Xero refresh token invalid — re-auth required", {
                integrationId: integration._id,
            });

            await markReAuthenticationRequired(integration._id);

            throw new Error("XERO_REAUTH_REQUIRED");
        }

        throw error;
    }
}