import z from "zod"
import { AppSlug, ZAppSlug } from "@snappin/shared/apps/app.schema"

export const ZDisconnectAccounting = z.object({
    integrationId: z.string(),
    appSlug: ZAppSlug
})

export type TDisconnectAccounting = {
    integrationId: string,
    appSlug: AppSlug
}