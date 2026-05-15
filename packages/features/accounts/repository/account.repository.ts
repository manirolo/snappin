import { IntegrationResource, StatusReason } from "@snappin/shared/integration/integration.schema"
import { db } from "@snappin/db/index"
import { connectDB } from "@snappin/db/connect"
import { IntegrationStatus } from "@snappin/shared/integration/status.enum"
import { AppRole } from "@snappin/shared/apps/app.schema"

connectDB()

export class AccountRepository {

    async create(data: IntegrationResource) {
        return await db.integration.create(data)
    }

    async update(integrationId: string, data: Partial<IntegrationResource>) {
        return await db.integration.findOneAndUpdate({ _id: integrationId, appRoles: [AppRole.EMAIL_SOURCE], }, data, { returnDocument: "after" })
    }

    async get(integrationId: string) {
        return await db.integration.findOne({ _id: integrationId, appRoles: [AppRole.EMAIL_SOURCE], })
    }

    async getAllMonitoredAccountsForAOrg(orgId: string) {
        return await db.integration.find({ orgId, appRoles: [AppRole.EMAIL_SOURCE], status: IntegrationStatus.CONNECTED })
    }

    async getExcessMonitoredAccounts(orgId: string, limit: number) {
        return await db.integration.find({ orgId, appRoles: [AppRole.EMAIL_SOURCE], status: IntegrationStatus.CONNECTED })
            .sort({ createdAt: 1 })
            .skip(limit)
    }

    // async getMonitorPausedAccountsForAOrg(orgId: string) {
    //     return await db.integration.find({ orgId, appRoles: [AppRole.EMAIL_SOURCE], status: IntegrationStatus.PAUSED })
    // }

    async getAccountsPausedByDowngrade(orgId: string, limit: number) {
        return await db.integration.find({
            orgId,
            appRoles: [AppRole.EMAIL_SOURCE],
            status: IntegrationStatus.PAUSED,
            statusReason: StatusReason.PLAN_DOWNGRADE,
        })
            .sort({ createdAt: 1 })
            .limit(limit)
    }

    async stopMonitoringAccountsForAOrg(orgId: string, integrationIds: string[]) {
        return await db.integration.updateMany(
            { orgId, _id: { $in: integrationIds }, appRoles: [AppRole.EMAIL_SOURCE], status: IntegrationStatus.CONNECTED },
            {
                $set: {
                    status: IntegrationStatus.PAUSED,
                    statusReason: StatusReason.PLAN_DOWNGRADE
                }
            }
        )
    }

    async resumeMonitoringAccountsForAOrg(orgId: string, integrationIds: string[]) {
        return await db.integration.updateMany(
            { orgId, _id: { $in: integrationIds }, appRoles: [AppRole.EMAIL_SOURCE], status: IntegrationStatus.PAUSED },
            {
                $set: {
                    status: IntegrationStatus.CONNECTED,
                    statusReason: null,
                }
            }
        )
    }

    async delete(integrationId: string) {
        await db.integration.findOneAndDelete({ _id: integrationId, appRoles: [AppRole.EMAIL_SOURCE], })
    }
}

export const accountRepository = new AccountRepository()