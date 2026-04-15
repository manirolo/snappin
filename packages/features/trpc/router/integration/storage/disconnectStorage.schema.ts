import z from "zod"
import { AppSlug, ZAppSlug } from "@snappin/shared/apps/app.schema"

export const ZDisconnectStorage = z.object({
    integrationId: z.string(),
    appSlug: ZAppSlug
})

export type TDisconnectStorage = {
    integrationId: string,
    appSlug: AppSlug
}