import { EmailAppsStore } from "@snappin/apps/appRegistry"
import { EmailAppSlug } from "@snappin/shared/apps/app.schema"
import { accountRepository } from "../repository/account.repository"
import { BASIC_LIMITS } from "@snappin/features/billing/service/usage.service"

export class AccountService {
    async pauseMonitoringAllAccountsForFreePlan(orgId: string) {
        // Fetch all actively monitored accounts for the org
        const accounts = await accountRepository.getExcessMonitoredAccounts(orgId, BASIC_LIMITS.emailAccounts);
        const pausedAccounts: string[] = []

        // Stop watching each integration with the provider (Google/Microsoft etc.)
        await Promise.allSettled(
            accounts.map(async (integration) => {
                try {
                    const provider = EmailAppsStore[integration.appSlug as EmailAppSlug]
                    if (provider?.stopWatching && integration?._id) {
                        await provider.stopWatching({ integration })
                        pausedAccounts.push(integration._id)
                    }
                } catch (error) {
                    console.warn(
                        `[AccountService] Failed to stop watching ${integration.appSlug} for integration ${integration._id}:`,
                        error
                    )
                }
            })
        )

        // Bulk update DB: disable monitoring + mark as PAUSED
        if (pausedAccounts.length > 0) {
            await accountRepository.stopMonitoringAccountsForAOrg(orgId, pausedAccounts)
        }

        console.log(`[AccountService] Paused monitoring for ${accounts.length} accounts in org: ${orgId}`)
    }

    async resumeMonitoringAllAccountsForPaidPlan(orgId: string, limits: number) {
        const accounts = await accountRepository.getAccountsPausedByDowngrade(orgId, limits)
        const resumedAccounts: string[] = []

        await Promise.allSettled(
            accounts.map(async (integration) => {
                try {
                    const provider = EmailAppsStore[integration.appSlug as EmailAppSlug]
                    if (provider?.startWatching && integration?._id) {
                        await provider.startWatching({ integration })
                        resumedAccounts.push(integration?._id)
                    }
                } catch (error) {
                    console.warn(
                        `[AccountService] Failed to resume watching ${integration.appSlug}:`,
                        error
                    )
                }
            })
        )

        if (resumedAccounts.length > 0) {
            await accountRepository.resumeMonitoringAccountsForAOrg(orgId, resumedAccounts)
        }

        console.log(`[AccountService] Resumed ${resumedAccounts.length} monitoring for org: ${orgId}`)
    }
}

export const accountService = new AccountService()