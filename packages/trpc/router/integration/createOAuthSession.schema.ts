import { ZAppSlug, ZAppCategory, ZAppType } from "@snappin/shared/apps/app.enum";
import z from "zod";

export const ZCreateNewOAuthSession = z.object({
    appSlug: ZAppSlug,
    appCategory: ZAppCategory,
    appType: ZAppType,
    redirectAfter: z.string(),
    reAuthenticate: z.object({
        integrationId: z.string()
    }).optional()
})
export type TCreateNewOAuthSessionResponse = {
    redirectUrl: string
}
export type TCreateNewOAuthSession = z.infer<typeof ZCreateNewOAuthSession>