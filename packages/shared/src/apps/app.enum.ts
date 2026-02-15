import z  from "zod"

export enum AppSlug {
    GMAIL = "gmail",
    OUTLOOK = "outlook"
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