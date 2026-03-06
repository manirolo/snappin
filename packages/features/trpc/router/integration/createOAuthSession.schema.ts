import { ZAppSlug, ZAppCategory, ZAppType, ZAppRole } from "@snappin/shared/apps/app.schema";
import z from "zod";

export const ZCreateNewOAuthSession = z.object({
    appSlug: ZAppSlug,
    appCategory: ZAppCategory,
    appType: ZAppType,
    appRole: z.array(ZAppRole),
    redirectAfter: z.string(),
    reAuthenticate: z.object({
        integrationId: z.string()
    }).optional()
})
export type TCreateNewOAuthSessionResponse = {
    redirectUrl: string
}
export type TCreateNewOAuthSession = z.infer<typeof ZCreateNewOAuthSession>