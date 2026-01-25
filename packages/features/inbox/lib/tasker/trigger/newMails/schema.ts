import { ZAppSlug } from "@snappin/shared/apps/app.enum"
import z from 'zod'

export const ZNewMailTaskSchema = z.object({
    appSlug: ZAppSlug,
    emailAddress: z.string(),
    historyId: z.number(),
})