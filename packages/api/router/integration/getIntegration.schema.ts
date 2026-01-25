import z from "zod";
import { AppCategory, AppSlug, ZAppCategory } from "@snappin/shared/apps/app.enum";
import { IntegrationStatus } from "@snappin/shared/integration/status.enum"

export const ZGetIntegration = z.object({
    appCategory: ZAppCategory.optional()
})

export type TGetIntegration = {
    appCategory?: AppCategory
}

export type GetIntegrationResponse = {
    _id: string,
    identifierEmail: string
    appSlug: AppSlug
    updateAt: number
    mailMonitored: boolean
    status: IntegrationStatus
}