import { BuildEmailIntegrationData } from "../../appRegistry.interface";
import { GmailAppServices } from "../gmail.app";

export async function buildIntegrationData({ accessToken, refreshToken, accessTokenExpiresAt }: BuildEmailIntegrationData) {
    const { historyId, expiresAt } = await GmailAppServices.startWatching({
        integration: { accessToken, refreshToken, accessTokenExpiresAt }
    })
    return {
        accessToken,
        accessTokenExpiresAt,
        refreshToken,
        config: {
            mailMonitored: true,
            historyId: Number(historyId),
            watchExpiresAt: expiresAt,
        }
    }
}
