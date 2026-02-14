import { AppCategory, AppSlug, AppType, ZAppCategory } from "@snappin/shared/apps/app.enum";
import { IntegrationStatus } from "@snappin/shared/integration/status.enum";
import z from "zod";

export type ConnectedEmailAccountsResponse = {
    _id: string,
    identifierEmail: string
    appType: AppType
    appSlug: AppSlug
    appCategory: AppCategory
    updatedAt: number
    reAuthenticationRequired: boolean
    mailMonitored: boolean
    status: IntegrationStatus
}