import { AppSlug } from "@snappin/shared/apps/app.schema";
import { BuildEmailIntegrationData, BuildEmailIntegrationDataResponse } from "../../appRegistry.interface";
import { OutlookAppServices } from "../outlook.app";
import { SnappinError } from "@snappin/lib/error/snappin.error";

export async function buildIntegrationData({
    code,
    codeVerifier
}: BuildEmailIntegrationData): Promise<BuildEmailIntegrationDataResponse<AppSlug.OUTLOOK>> {

    if (!code || !codeVerifier) {
        throw new SnappinError("We received partial or no integration data from Outlook", "invalid_integration_request")
    }

    const { accessToken, refreshToken, accessTokenExpiresAt } = await OutlookAppServices.exchangeCodeForTokens({ code, codeVerifier })

    const { emailAddress } = await OutlookAppServices.getUserEmailAddress({
        accessToken
    })

    const integration = { accessToken, accessTokenExpiresAt, refreshToken }

    const { subscriptionId, expiresAt } = await OutlookAppServices.startWatching({
        integration
    })

    return {
        accessToken,
        accessTokenExpiresAt,
        refreshToken,
        identifierEmail: emailAddress,
        config: {
            mailMonitored: true,
            subscriptionId,
            subscriptionExpiresAt: expiresAt
        }
    }
}
