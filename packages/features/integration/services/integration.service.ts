// services/integration.service.ts
import { resolveProvider } from "@snappin/apps/lib/resolveProvider"
import { AppCategory, AppSlug } from "@snappin/shared/apps/app.schema"
import { IntegrationResource } from "@snappin/shared/integration/integration.schema"
import { connectDB } from "@snappin/db/connect"
import { db } from "@snappin/db/index"

connectDB()

export class IntegrationService {
    private readonly db = db

    private async revokeOne(integration: IntegrationResource): Promise<void> {
        try {
            // Skip communication apps — no token to revoke
            if (integration.appCategory === AppCategory.COMMUNICATION) return

            if (!integration.refreshToken) return

            // Guard: skip if appCategory or appSlug is missing
            if (!integration.appCategory || !integration.appSlug) {
                console.warn("[integrationService] Missing appCategory or appSlug, skipping:", integration._id)
                return
            }

            const provider = resolveProvider(integration.appCategory, integration.appSlug) 

            // Skip revoke if another integration shares the same provider + email
            const otherIntegration = await this.db.integration.findOne({
                _id: { $ne: integration._id },
                identifierEmail: integration.identifierEmail,
                provider: integration.provider,
            })

            if (otherIntegration) {
                console.log("[integrationService] Shared provider — skipping token revocation")
                return
            }

            await provider.revokeToken({
                token: integration.refreshToken,
                accessToken: integration.accessToken,
            })
        } catch (err) {
            const isInvalidGrant =
                err instanceof Error &&
                (err.message.includes("invalid_grant") || err.message.includes("invalid_token"))

            if (isInvalidGrant) {
                console.warn("[integrationService] Token already invalid, skipping revoke:", integration._id)
                return
            }

            throw err
        }
    }

    // Revoke + delete a single integration (used in removeIntegration)
    async removeOne(integrationId: string): Promise<void> {
        const integration = await this.db.integration.findOne({ _id: integrationId }) as IntegrationResource
        if (!integration) return

        try {
            await this.revokeOne(integration)
        } catch (error) {
            console.warn(
                `[IntegrationService] Failed to revoke ${integration.appSlug} for integration ${integration._id}:`,
                error
            )
            return
        }

        await this.db.integration.deleteOne({ _id: integrationId })

        if (integration.appSlug === AppSlug.XERO) {
            await this.db.organization.findOneAndUpdate(
                { clerkOrgId: integration.orgId },
                { $set: { [`usage.integrations.${integration.appSlug}`]: false } }
            )
        }
    }

    // Revoke all + delete all for an org (used in deleteUser admin flow)
    async removeAllForOrg(orgId: string): Promise<void> {
        const integrations = await this.db.integration.find({ orgId }) as IntegrationResource[]
        if (!integrations.length) return

        // Revoke all tokens (ignore individual failures)
        await Promise.allSettled(
            integrations.map((int) => this.revokeOne(int))
        )

        // Bulk delete after all revokes attempted
        await this.db.integration.deleteMany({ orgId })
    }

    // Revoke all + delete all for a single user (used in deleteUser member flow)
    async removeAllForUser(orgId: string, userId: string): Promise<void> {
        const integrations = await this.db.integration.find({ orgId, userId }) as IntegrationResource[]
        if (!integrations.length) return

        await Promise.allSettled(
            integrations.map((int) => this.revokeOne(int))
        )

        await this.db.integration.deleteMany({ orgId, userId })
    }

    async removePaidIntegrations(orgId: string) {
        const integrations = await this.db.integration.find({
            orgId,
            appSlug: { $in: [AppSlug.XERO] }
        }) as IntegrationResource[]

        if (!integrations.length) return

        const removedIds: string[] = []
        const removedSlugs: string[] = []

        // Revoke tokens individually — track only successful revokes
        await Promise.allSettled(
            integrations.map(async (int) => {
                try {
                    await this.revokeOne(int)
                    if (int._id && int.appSlug) {
                        removedIds.push(int._id.toString())
                        removedSlugs.push(int.appSlug)
                    }
                } catch (error) {
                    console.warn(
                        `[IntegrationService] Failed to revoke ${int.appSlug} for integration ${int._id}:`,
                        error
                    )
                }
            })
        )

        if (removedIds.length === 0) return

        // Hard delete only successfully revoked integrations
        await this.db.integration.deleteMany({
            orgId,
            _id: { $in: removedIds },
        })

        // Mark each removed slug as false in org usage
        const uniqueSlugs = Array.from(new Set(removedSlugs))
        const usageUpdate = Object.fromEntries(
            uniqueSlugs.map((slug) => [`usage.integrations.${slug}`, false])
        )

        await this.db.organization.findOneAndUpdate(
            { clerkOrgId: orgId },
            { $set: usageUpdate }
        )

        console.log(`[IntegrationService] Removed ${removedIds.length} paid integrations for org: ${orgId}`)
    }
}

export const integrationService = new IntegrationService()