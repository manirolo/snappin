import { AppCategory, AppMetadata, AppRole, AppSlug, AppType } from "@snappin/shared/apps/app.schema";

export const whatsappMetadata: AppMetadata = {
    id: "IN004",
    name: "WhatsApp",
    publisher: {
        name: "Snappin",
        email: "support@snappinapp.com"
    },
    description: "Send invoices via whatsapp",
    iconifyIcon: "logos:whatsapp-icon",
    logoUrl: "/images/vendors/logos/whatsapp.png",
    disclaimer: null,
    slug: AppSlug.WHATSAPP,
    role: [AppRole.MOBILE_SCANNER],
    category: AppCategory.COMMUNICATION,
    type: AppType.SOURCE,
    enableOnOnboarding: false,
    isComingSoon: false
}