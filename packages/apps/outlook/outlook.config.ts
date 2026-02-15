import { env } from "@snappin/env";
import { AppCategory, AppSlug, AppType } from "@snappin/shared/apps/app.enum";

const getNotificationUrl = () => {
    return env.env == "development" ? "https://natashia-diriment-donnie.ngrok-free.dev" : env.app.api_url
}

const notificationUrl = getNotificationUrl()

export const outlookConfig = {
    name: "Outlook",
    slug: AppSlug.OUTLOOK,
    category: AppCategory.EMAIL,
    type: AppType.SOURCE,
    publisher: "Snappin",
    email: "support@snappinapp.com",
    description: "Connect your outlook account to extract invoices",
    icon: "logos:microsoft-icon",
    note: "We only scan invoice-related emails",

    clientId: env.microsoft.clientId,
    clientSecret: env.microsoft.clientSecret,
    tenantId: env.microsoft.tenantId,
    callbackUrl: `${env.app.api_url}/api/v1/integration/callback`,
    notificationUrl: `${notificationUrl}/api/v1/webhook/mail?appSlug=${AppSlug.OUTLOOK}`,
    permissions: ["openid",
        "offline_access",
        "https://graph.microsoft.com/User.Read",
        "https://graph.microsoft.com/Mail.Read"],

    enableOnOnboarding: true,
}