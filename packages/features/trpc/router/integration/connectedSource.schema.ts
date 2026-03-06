import { AppCategory, AppSlug, AppType, ZAppRole, ZAppType } from "@snappin/shared/apps/app.schema";
import { IntegrationStatus } from "@snappin/shared/integration/status.enum";
import z from "zod"

export const ZConnectedSource = z.object({
    appType: ZAppType.optional().nullable(),
    appRole: ZAppRole.optional().nullable(),
})
export type TConnectedSource = z.infer<typeof ZConnectedSource>

export type ConnectedSourceResponse = {
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