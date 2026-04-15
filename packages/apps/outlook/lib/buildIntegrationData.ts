import { BuildEmailIntegrationData } from "../../appRegistry.interface";
import { OutlookAppServices } from "../outlook.app";

export async function buildIntegrationData({ accessToken, refreshToken, accessTokenExpiresAt }: BuildEmailIntegrationData) {
    const { subscriptionId, expiresAt } = await OutlookAppServices.startWatching({
        integration: { accessToken, accessTokenExpiresAt, refreshToken }
    })
    return {
        accessToken,
        accessTokenExpiresAt,
        refreshToken,
        metadata: {
            subscriptionId,
            subscriptionExpiresAt: expiresAt,
        }
    }
}
