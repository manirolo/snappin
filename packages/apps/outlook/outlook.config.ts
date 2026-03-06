import { env } from "@snappin/env";
import { AppSlug } from "@snappin/shared/apps/app.schema";
import { OutlookConfigData } from "./outlook.types";

const getNotificationUrl = () => {
    return env.env == "development" ? "https://natashia-diriment-donnie.ngrok-free.dev" : env.app.api_url
}

const notificationUrl = getNotificationUrl()

export const outlookConfig: OutlookConfigData = {
    clientId: env.microsoft.clientId,
    clientSecret: env.microsoft.clientSecret,
    tenantId: env.microsoft.tenantId,
    callbackUrl: `${env.app.api_url}/api/v1/integration/callback`,
    notificationUrl: `${notificationUrl}/api/v1/webhook/mail?appSlug=${AppSlug.OUTLOOK}`,
    permissions: ["openid",
        "offline_access",
        "https://graph.microsoft.com/User.Read",
        "https://graph.microsoft.com/Mail.Read"],
}