import z from "zod"
import { AppSlug, ZAppSlug } from "@snappin/shared/apps/app.schema"

export const ZDisconnectAccount = z.object({
    integrationId: z.string(),
    appSlug: ZAppSlug
})

export type TDisconnectAccount = {
    integrationId: string,
    appSlug: AppSlug
}