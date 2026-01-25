import { AppCategory, AppSlug, ZAppSlug, ZAppCategory } from "@snappin/shared/apps/app.enum";
import z from "zod";

export const ZCreateNewOAuthSession = z.object({
    appSlug: ZAppSlug,
    appCategory: ZAppCategory,
    redirectAfter: z.string()
})
export type TCreateNewOAuthSessionResponse = {
    redirectUrl: string
}
export type TCreateNewOAuthSession = z.infer<typeof ZCreateNewOAuthSession>