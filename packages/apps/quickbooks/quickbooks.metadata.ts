import { AppCategory, AppMetadata, AppRole, AppSlug, AppType } from "@snappin/shared/apps/app.schema";

export const telegramMetadata: AppMetadata = {
    name: "Quickbooks",
    publisher: {
        name: "Snappin",
        email: "support@snappinapp.com"
    },
    description: "Export receipts to Quickbooks",
    iconifyIcon: "tabler:at",
    cta: "Connect Quickbooks",
    logoUrl: "/images/vendors/logos/imap.png",
    disclaimer: "",
    slug: AppSlug.QUICKBOOKS,
    role: [AppRole.INVOICE_DESTINATION],
    category: AppCategory.ACCOUNTING,
    type: AppType.DESTINATION,
    // services: GmailAppServices,
    enableOnOnboarding: false,
    isComingSoon: true,
}