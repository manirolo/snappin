import { AppCategory, AppMetadata, AppRole, AppSlug, AppType, Provider } from "@snappin/shared/apps/app.schema";

export const outlookMetadata: AppMetadata = {
    id: "IN002",
    name: "Outlook",
    provider: Provider.MICROSOFT,
    publisher: {
        name: "Snappin",
        email: "support@snappinapp.com"
    },
    description: "Connect your outlook account to extract invoices",
    cta: "Connect Outlook account",
    iconifyIcon: "logos:microsoft-icon",
    logoUrl: "/images/vendors/logos/microsoft.png",
    disclaimer: "We only scan invoice-related emails",
    slug: AppSlug.OUTLOOK,
    role: [AppRole.EMAIL_SOURCE],
    category: AppCategory.EMAIL,
    type: AppType.SOURCE,
    enableOnOnboarding: true
}