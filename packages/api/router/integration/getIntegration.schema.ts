import z from "zod";
import { AppCategory, AppSlug, AppType, ZAppCategory } from "@snappin/shared/apps/app.enum";
import { IntegrationStatus } from "@snappin/shared/integration/status.enum"

export const ZGetIntegration = z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10),
})

export type TGetIntegration = z.infer<typeof ZGetIntegration>

export type GetIntegrationResponse = {
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