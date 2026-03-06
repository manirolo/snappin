import z from "zod"
import { AppSlug, ZAppSlug } from "@snappin/shared/apps/app.schema"

export const ZRemoveIntegration = z.object({
    integrationId: z.string(),
    appSlug: ZAppSlug
})

export type TRemoveIntegration = {
    integrationId: string,
    appSlug: AppSlug
}