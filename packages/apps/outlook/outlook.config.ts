import { env } from "@snappin/env";
import { AppCategory, AppSlug, AppType } from "@snappin/shared/apps/app.enum";

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
    callbackUrl: `${env.app_url}/api/v1/integration/callback`,
    permissions: ["openid",
        "offline_access",
        "https://graph.microsoft.com/User.Read",
        "https://graph.microsoft.com/Mail.Read"],

    enableOnOnboarding: true,
}