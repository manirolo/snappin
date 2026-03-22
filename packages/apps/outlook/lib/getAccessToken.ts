import { logger } from "@snappin/lib/logger";
import { RetrieveAccessToken, RetrieveAccessTokenResponse } from "../../appRegistry.interface";
import { outlook } from "../outlook.client";
import { compareAndSaveIfNewToken } from "../../utils/compareAndSaveIfNewToken";
import { isInvalidGrantError } from "../../utils/isInvalidGrantError";
import { markReAuthenticationRequired } from "../../utils/markReAuthenticationRequired";
import { outlookConfig } from "../outlook.config";

export async function getAccessToken({ integration }: RetrieveAccessToken): Promise<RetrieveAccessTokenResponse> {
    const REFRESH_BUFFER_MS = 60 * 1000;

    const expiresAt = integration.accessTokenExpiresAt
        ? new Date(integration.accessTokenExpiresAt).getTime()
        : null;

    const isExpired = !expiresAt || expiresAt - REFRESH_BUFFER_MS <= Date.now();

    // ✅ If still valid, reuse
    if (!isExpired  && integration.accessToken) {
        return { accessToken: integration.accessToken };
    }

    if (!integration.refreshToken) {
        throw new Error("Refresh token missing. Re-authentication required.");
    }

    try {
        const tokens = await outlook.refreshAccessToken(
            integration.refreshToken,
            outlookConfig.permissions
        );

        const newAccessToken = tokens.accessToken();
        const newAccessTokenExpiresAt = tokens.accessTokenExpiresAt();

        await compareAndSaveIfNewToken({
            integration,
            accessTokenFromFn: newAccessToken,
            accessTokenExpiresAtFromFn: newAccessTokenExpiresAt,
        });

        return {
            accessToken: newAccessToken,
        };

    } catch (error) {
        logger.error("Failed to refresh Microsoft access token", error);

        if (isInvalidGrantError(error) && integration._id) {
            logger.warn("Microsoft refresh token invalid_grant – re-auth required", {
                integrationId: integration._id,
            });

            await markReAuthenticationRequired(integration._id);

            throw new Error("MICROSOFT_REAUTH_REQUIRED");
        }

        throw error;
    }
}