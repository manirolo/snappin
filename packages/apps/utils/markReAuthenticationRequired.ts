import { db } from "@snappin/db/index"
import { IntegrationStatus } from "@snappin/shared/integration/status.enum";

export async function markReAuthenticationRequired(integrationId: string) {
    return await db.integration.findOneAndUpdate({ _id: integrationId }, { $set: { reAuthenticationRequired: true, status: IntegrationStatus.REAUTH_REQUIRED } })
}