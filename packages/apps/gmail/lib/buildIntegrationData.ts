import { AppSlug } from "@snappin/shared/apps/app.enum";
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

    const { historyId, expiresAt } = await GmailAppServices.startWatching({
        accessToken
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
