import { AppCategory, AppMetadata, AppRole, AppSlug, AppType } from "@snappin/shared/apps/app.schema";

export const xeroMetadata: AppMetadata = {
    name: "Xero",
    publisher: {
        name: "Snappin",
        email: "support@snappinapp.com"
    },
    description: "Export invoices to Xero accounting",
    iconifyIcon: "logos:xero",
    disclaimer: null,
    slug: AppSlug.XERO,
    role: [AppRole.INVOICE_DESTINATION],
    category: AppCategory.ACCOUNTING,
    type: AppType.DESTINATION,
    enableOnOnboarding: false,
    isComingSoon: true
}