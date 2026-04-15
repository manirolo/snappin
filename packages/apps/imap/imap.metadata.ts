import { AppCategory, AppMetadata, AppRole, AppSlug, AppType } from "@snappin/shared/apps/app.schema";

export const imapMetadata: AppMetadata = {
    id: "IN005",
    name: "IMAP",
    publisher: {
        name: "Snappin",
        email: "support@snappinapp.com"
    },
    description: "Connect your company email account to extract invoices",
    iconifyIcon: "tabler:at",
    cta: "Connect Company account",
    logoUrl: "/images/vendors/logos/imap.png",
    disclaimer: "We only scan invoice-related emails",
    slug: AppSlug.IMAP,
    role: [AppRole.EMAIL_SOURCE],
    category: AppCategory.EMAIL,
    type: AppType.SOURCE,
    // services: GmailAppServices,
    enableOnOnboarding: false,
    isComingSoon: true,
}