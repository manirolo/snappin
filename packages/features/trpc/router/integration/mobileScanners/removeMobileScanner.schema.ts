import z from "zod"
import { AppSlug, ZAppSlug } from "@snappin/shared/apps/app.schema"

export const ZRemoveMobileScanner = z.object({
    integrationId: z.string(),
    appSlug: ZAppSlug
})

export type TRemoveMobileScanner = {
    integrationId: string,
    appSlug: AppSlug
}