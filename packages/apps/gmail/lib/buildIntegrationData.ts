import { AppSlug } from "@snappin/shared/apps/app.schema";
import { BuildEmailIntegrationData, BuildEmailIntegrationDataResponse } from "../../appRegistry.interface";
import { GmailAppServices } from "../gmail.app";
import { SnappinError } from "@snappin/lib/error/snappin.error";

export async function buildIntegrationData({
    code,
    codeVerifier
}: BuildEmailIntegrationData): Promise<BuildEmailIntegrationDataResponse<AppSlug.GMAIL>> {
    
    if(!code || !codeVerifier){
        throw new SnappinError("We received partial or no integration data from Outlook", "invalid_integration_request")
    }
    
    const { accessToken, refreshToken, accessTokenExpiresAt } = await GmailAppServices.exchangeCodeForTokens({ code, codeVerifier })

    const { emailAddress } = await GmailAppServices.getUserEmailAddress({
        accessToken
    })

    const integration = { accessToken, refreshToken, accessTokenExpiresAt }

    const { historyId, expiresAt } = await GmailAppServices.startWatching({
        integration
    })

    return {
        accessToken,
        accessTokenExpiresAt,
        refreshToken,
        identifierEmail: emailAddress,
        config: {
            mailMonitored: true,
            historyId: Number(historyId),
            watchExpiresAt: expiresAt
        }
    }
}
