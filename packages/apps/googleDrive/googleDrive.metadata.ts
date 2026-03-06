import { AppCategory, AppMetadata, AppRole, AppSlug, AppType } from "@snappin/shared/apps/app.schema";

export const googleDriveMetadata: AppMetadata = {
    name: "Google Drive",
    publisher: {
        name: "Snappin",
        email: "support@snappinapp.com"
    },
    description: "Store invoices on Drive",
    iconifyIcon: "logos:google-drive",
    logoUrl: "./images/vendors/logos/google.png",
    disclaimer: null,
    slug: AppSlug.GOOGLE_DRIVE,
    role: [AppRole.STORAGE],
    category: AppCategory.COMMUNICATION,
    type: AppType.SOURCE,
    enableOnOnboarding: false,
    isComingSoon: true
}