import { AppCategory, AppMetadata, AppRole, AppSlug, AppType } from "@snappin/shared/apps/app.schema";

export const gmailMetadata: AppMetadata = {
    name: "Gmail",
    publisher: {
        name: "Snappin",
        email: "support@snappinapp.com"
    },
    description: "Connect your gmail account to extract invoices",
    cta: "Connect Gmail account",
    iconifyIcon: "logos:google-gmail",
    logoUrl: "/images/vendors/logos/google.png",
    disclaimer: "We only scan invoice-related emails",
    slug: AppSlug.GMAIL,
    role: [AppRole.EMAIL_SOURCE],
    category: AppCategory.EMAIL,
    type: AppType.SOURCE,
    // services: GmailAppServices,
    enableOnOnboarding: true
}