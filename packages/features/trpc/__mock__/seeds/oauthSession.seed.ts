import { db } from "@snappin/db/index"
import { AppSlug, AppCategory, AppRole, AppType } from "@snappin/shared/apps/app.schema"

type WithId<T> = T & { _id: string }

export async function seedOAuthSession(overrides = {}) {
    const session = await db.oauthSession.create({
        state: "valid_state_123",
        userId: "user_123",
        orgId: "org_abc",
        appSlug: AppSlug.GMAIL,
        appCategory: AppCategory.EMAIL,
        appRoles: [AppRole.EMAIL_SOURCE],
        appType: AppType.SOURCE,
        scope: ["email profile"],
        redirectAfter: "/dashboard",
        reAuthenticateSession: false,
        codeVerifier: "code_verifier_abc",
        ...overrides,
    })
    return session as WithId<typeof session>
}