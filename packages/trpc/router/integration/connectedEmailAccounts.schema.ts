import { AppCategory, AppSlug, AppType } from "@snappin/shared/apps/app.enum";
import { IntegrationStatus } from "@snappin/shared/integration/status.enum";

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