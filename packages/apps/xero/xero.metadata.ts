import { AppCategory, AppMetadata, AppRole, AppSlug, AppType, Provider } from "@snappin/shared/apps/app.schema";

export const xeroMetadata: AppMetadata = {
    name: "Xero",
    publisher: {
        name: "Snappin",
        email: "support@snappinapp.com"
    },
    description: "Export invoices to Xero accounting",
    iconifyIcon: "logos:xero",
    logoUrl: "/images/vendors/logos/xero.png",
    disclaimer: null,
    slug: AppSlug.XERO,
    role: [AppRole.INVOICE_DESTINATION],
    category: AppCategory.ACCOUNTING,
    type: AppType.DESTINATION,
    provider: Provider.XERO,
    enableOnOnboarding: false,
    isComingSoon: false
}