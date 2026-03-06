import { AppCategory, AppMetadata, AppRole, AppSlug, AppType } from "@snappin/shared/apps/app.schema";

export const whatsappMetadata: AppMetadata = {
    name: "WhatsApp",
    publisher: {
        name: "Snappin",
        email: "support@snappinapp.com"
    },
    description: "Send invoices via whatsapp",
    iconifyIcon: "logos:whatsapp-icon",
    disclaimer: null,
    slug: AppSlug.WHATSAPP,
    role: [AppRole.MOBILE_SCANNER],
    category: AppCategory.COMMUNICATION,
    type: AppType.SOURCE,
    enableOnOnboarding: false,
    isComingSoon: true
}