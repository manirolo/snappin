import { mobileScannerRepository } from "../repository/mobileScanner.repository"
import { BASIC_LIMITS } from "@snappin/features/billing/service/usage.service"

export class MobileScannerService {

    async pauseScannersForFreePlan(orgId: string) {
        const scanners = await mobileScannerRepository.getExcessMobileScanners(orgId, BASIC_LIMITS.mobileScanners)

        const scannerIds = scanners.flatMap((s) => s._id ? [s._id] : [])

        if (scannerIds.length > 0) {
            await mobileScannerRepository.pauseMobileScannersForAOrg(orgId, scannerIds)
        }

        console.log(`[MobileScannerService] Paused ${scannerIds.length} scanners for org: ${orgId}`)
    }

    async resumeScannersForPaidPlan(orgId: string, limit: number) {
        const scanners = await mobileScannerRepository.getScannersPausedByDowngrade(orgId, limit)

        const scannerIds = scanners.flatMap((s) => s._id ? [s._id] : [])

        if (scannerIds.length > 0) {
            await mobileScannerRepository.resumeMobileScannersForAOrg(orgId, scannerIds)
        }

        console.log(`[MobileScannerService] Resumed ${scannerIds.length} scanners for org: ${orgId}`)
    }
}

export const mobileScannerService = new MobileScannerService()