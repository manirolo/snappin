import { logger } from "@snappin/lib/logger";
import { RetrieveAccessToken, RetrieveAccessTokenResponse } from "../../appRegistry.interface";
import { google } from "../gmail.client"
import { compareAndSaveIfNewToken } from "../../utils/compareAndSaveIfNewToken";
import { isInvalidGrantError } from "../../utils/isInvalidGrantError";
import { markReAuthenticationRequired } from "../../utils/markReAuthenticationRequired";

export async function getAccessToken({ integration }: RetrieveAccessToken): Promise<RetrieveAccessTokenResponse> {
    // Safety buffer (e.g. refresh 1 min before expiry)
    const REFRESH_BUFFER_MS = 60 * 1000;

    const isExpired = !integration.accessTokenExpiresAt || integration.accessTokenExpiresAt.getTime() - REFRESH_BUFFER_MS <= Date.now();

    // If token is still valid, reuse it
    if (!isExpired && integration.accessToken) {
        return { accessToken: integration.accessToken };
    }

    if (!integration.refreshToken) {
        throw new Error("Refresh token missing. Re-authentication required.");
    }

    try {
        const tokens = await google.refreshAccessToken(integration.refreshToken);

        const newAccessToken = tokens.accessToken();
        const newAccessTokenExpiresAt = tokens.accessTokenExpiresAt();

        /**
         * ⚠️ IMPORTANT (recommended):
         * Persist newAccessTokenExpiresAt in DB
         * Example:
         * await db.integration.updateOne({ ... }, {
         *   accessTokenExpiresAt: newAccessTokenExpiresAt
         * })
         */

        await compareAndSaveIfNewToken({ integration, accessTokenFromFn: newAccessToken, accessTokenExpiresAtFromFn: newAccessTokenExpiresAt })

        return {
            accessToken: newAccessToken,
        };
        
    } catch (error) {
        logger.error("Failed to refresh Google access token", error);

        if (isInvalidGrantError(error) && integration._id) {
            logger.warn("Google refresh token invalid_grant – re-auth required", {
                integrationId: integration._id,
            });

            await markReAuthenticationRequired(integration._id)

            throw new Error("GOOGLE_REAUTH_REQUIRED");
        }
        throw error;
    }
}