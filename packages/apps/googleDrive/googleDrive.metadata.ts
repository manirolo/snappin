import { AppCategory, AppMetadata, AppRole, AppSlug, AppType, Provider } from "@snappin/shared/apps/app.schema";

export const googleDriveMetadata: AppMetadata = {
    id: "IN003",
    name: "Google Drive",
    provider: Provider.GOOGLE,
    publisher: {
        name: "Snappin",
        email: "support@snappinapp.com"
    },
    description: "Store invoices on Google Drive",
    iconifyIcon: "logos:google-drive",
    logoUrl: "/images/vendors/logos/google_drive.png",
    disclaimer: null,
    slug: AppSlug.GOOGLE_DRIVE,
    role: [AppRole.STORAGE],
    category: AppCategory.STORAGE,
    type: AppType.DESTINATION,
    enableOnOnboarding: true,
}