import { AppCategory, AppMetadata, AppRole, AppSlug, AppType } from "@snappin/shared/apps/app.schema";

export const telegramMetadata: AppMetadata = {
    name: "Telegram",
    publisher: {
        name: "Snappin",
        email: "support@snappinapp.com"
    },
    description: "Connect your telegram account to send receipts and invoices",
    iconifyIcon: "tabler:at",
    cta: "Connect Telegram",
    logoUrl: "/images/vendors/logos/imap.png",
    disclaimer: "Privacy first",
    slug: AppSlug.TELEGRAM,
    role: [AppRole.MOBILE_SCANNER],
    category: AppCategory.COMMUNICATION,
    type: AppType.SOURCE,
    // services: GmailAppServices,
    enableOnOnboarding: false,
    isComingSoon: true,
}