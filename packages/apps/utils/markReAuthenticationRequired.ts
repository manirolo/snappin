import { db } from "@snappin/db/index"

export async function markReAuthenticationRequired(integrationId: string) {
    return await db.integration.findOneAndUpdate({ _id: integrationId }, { $set: { reAuthenticationRequired: true } })
}