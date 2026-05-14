import z from "zod"

export enum Provider {
    GOOGLE = "google",
    MICROSOFT = "microsoft",
    XERO = "xero"
}

export enum AppSlug {
    GMAIL = "gmail",
    OUTLOOK = "outlook",
    IMAP = "imap",
    WHATSAPP = "whatsapp",
    GOOGLE_DRIVE = "google_drive",
    XERO = "xero",
    MS_SHARED_ACCOUNT = "ms_shared_account",
    TELEGRAM = "telegram",
    ONE_DRIVE = "one_drive",
    QUICKBOOKS = "quickbooks",
    GOOGLE_SHEET = "google_sheet"
}
export type EmailAppSlug = AppSlug.GMAIL | AppSlug.OUTLOOK | AppSlug.MS_SHARED_ACCOUNT;
export type StorageAppSlug = AppSlug.GOOGLE_DRIVE | AppSlug.ONE_DRIVE
export type AccountingAppSlug = AppSlug.XERO | AppSlug.QUICKBOOKS

export enum AppRole {
    EMAIL_SOURCE = "email_source",
    FILE_SOURCE = "file_source",
    MANUAL_SOURCE = "manual_source",
    INVOICE_DESTINATION = "invoice_destination",
    WEBHOOK_SOURCE = "webhook_source",
    MOBILE_SCANNER = "mobile_scanner",
    STORAGE = "storage"
}
export enum AppType {
    SOURCE = "source",
    DESTINATION = "destination"
}
export enum AppCategory {
    EMAIL = "email",
    PAYMENTS = "payments",
    CALENDAR = "calendar",
    ECOMMERCE = "ecommerce",
    ACCOUNTING = "accounting",
    COMMUNICATION = "communication",
    PRODUCTIVITY = "productivity",
    STORAGE = "storage",
}
export enum SourceKind {
    INTEGRATION = "integration",
    MANUAL = "manual"
}

export type AppMetadata = {
    id?: string
    name: string
    publisher: {
        name: string
        email: string
    }
    description: string
    cta?: string
    iconifyIcon: string
    logoUrl?: string
    disclaimer: string | null
    provider?: Provider,
    slug: AppSlug
    role: AppRole[]
    category: AppCategory
    type: AppType
    isComingSoon?: boolean
    enableOnOnboarding: boolean
}
export interface AppDefinition<TConfigData = unknown> {
    provider?: Provider,
    slug: AppSlug
    role: AppRole[]
    category: AppCategory
    type: AppType
    config: TConfigData,
    metadata: AppMetadata,
}
export const ZAppSlug = z.enum(
    Object.values(AppSlug) as [AppSlug, ...AppSlug[]]
)
export const ZAppCategory = z.enum(
    Object.values(AppCategory) as [AppCategory, ...AppCategory[]]
)
export const ZAppType = z.enum(
    Object.values(AppType) as [AppType, ...AppType[]]
)
export const ZAppRole = z.enum(AppRole)
export const ZSourceKind = z.enum(SourceKind)
export const ZEmailAppSlug = z.enum([AppSlug.GMAIL, AppSlug.OUTLOOK] as const)