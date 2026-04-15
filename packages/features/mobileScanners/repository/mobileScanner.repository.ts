import { IntegrationResource, StatusReason } from "@snappin/shared/integration/integration.schema"
import { db } from "@snappin/db/index"
import { connectDB } from "@snappin/db/connect"
import { IntegrationStatus } from "@snappin/shared/integration/status.enum"
import { AppRole } from "@snappin/shared/apps/app.schema"

connectDB()

export class MobileScannerRepository {

    async create(data: IntegrationResource) {
        return await db.integration.create(data)
    }

    async update(integrationId: string, data: Partial<IntegrationResource>) {
        return await db.integration.findOneAndUpdate(
            { _id: integrationId, appRoles: [AppRole.MOBILE_SCANNER] },
            data,
            { returnDocument: "after" }
        )
    }

    async get(integrationId: string) {
        return await db.integration.findOne({ _id: integrationId, appRoles: [AppRole.MOBILE_SCANNER] })
    }

    async getAllMobileScannersForAOrg(orgId: string) {
        return await db.integration.find({ orgId, appRoles: [AppRole.MOBILE_SCANNER], status: IntegrationStatus.CONNECTED })
    }

    async getExcessMobileScanners(orgId: string, limit: number) {
        return await db.integration
            .find({ orgId, appRoles: [AppRole.MOBILE_SCANNER], status: IntegrationStatus.CONNECTED })
            .sort({ createdAt: 1 })
            .skip(limit)
    }

    async getScannersPausedByDowngrade(orgId: string, limit: number) {
        return await db.integration
            .find({
                orgId,
                appRoles: [AppRole.MOBILE_SCANNER],
                status: IntegrationStatus.PAUSED,
                statusReason: StatusReason.PLAN_DOWNGRADE,
            })
            .sort({ createdAt: 1 })
            .limit(limit)
    }

    async pauseMobileScannersForAOrg(orgId: string, integrationIds: string[]) {
        return await db.integration.updateMany(
            { _id: { $in: integrationIds }, orgId, appRoles: [AppRole.MOBILE_SCANNER], status: IntegrationStatus.CONNECTED },
            {
                $set: {
                    status: IntegrationStatus.PAUSED,
                    statusReason: StatusReason.PLAN_DOWNGRADE,
                },
            }
        )
    }

    async resumeMobileScannersForAOrg(orgId: string, integrationIds: string[]) {
        return await db.integration.updateMany(
            { _id: { $in: integrationIds }, orgId, appRoles: [AppRole.MOBILE_SCANNER], status: IntegrationStatus.PAUSED, statusReason: StatusReason.PLAN_DOWNGRADE },
            {
                $set: {
                    status: IntegrationStatus.CONNECTED,
                    statusReason: null,
                },
            }
        )
    }

    async delete(integrationId: string) {
        await db.integration.findOneAndDelete({ _id: integrationId, appRoles: [AppRole.MOBILE_SCANNER] })
    }
}

export const mobileScannerRepository = new MobileScannerRepository()