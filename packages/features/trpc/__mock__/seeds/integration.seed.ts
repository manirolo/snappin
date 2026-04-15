import { db } from "@snappin/db/index"
import { appMetadata } from "@snappin/apps/app.metadata"
import { AppSlug } from "@snappin/shared/apps/app.schema"
import { IntegrationStatus } from "@snappin/shared/integration/status.enum"
import { Types } from "mongoose"

type WithId<T> = T & { _id: Types.ObjectId }

export async function seedAccount(overrides = {}, appSlug?: AppSlug,) {
    const app = appMetadata[appSlug ?? AppSlug.GMAIL]
    const account = await db.integration.create({
        userId: "user_123",
        orgId: "org_abc",
        appSlug: app.slug,
        appCategory: app.category,
        appType: app.type,
        identifierEmail: "user@example.com",
        accessToken: "accessToken",
        refreshToken: "refreshToken",
        config: {},
        status: IntegrationStatus.CONNECTED,
        ...overrides,
    })

    return account as WithId<typeof account>
}