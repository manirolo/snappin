import { TRPCError } from "@trpc/server"
import { ContextProps } from "../../_trpc"
import { clerk } from "../../config/clerk"
import { TDeleteUser } from "./deleteUser.schema"
import { storageService } from "@snappin/infra/google/storage"
import { IntegrationService } from "@snappin/features/integration/services/integration.service"
import { cancelSubscription } from "@lemonsqueezy/lemonsqueezy.js"
import { getLemonSqueezy } from "../../config/ls"

export type DeleteUser = {
    ctx: ContextProps
    input: TDeleteUser
}


export async function deleteUser({ ctx, input }: DeleteUser) {
    const user = await clerk.users.getUser(input.userId)

    getLemonSqueezy()

    if (!user) {
        throw new TRPCError({ message: "Unauthorized! Please login", code: "UNAUTHORIZED" })
    }

    if (!ctx.orgId || !ctx.userId) {
        throw new TRPCError({ message: "Missing org or user context", code: "BAD_REQUEST" })
    }

    const { data: memberships } = await clerk.users.getOrganizationMembershipList({
        userId: input.userId,
    })

    const isAdmin = memberships.some((membership) => membership.role === "org:admin")
    const integrationService = new IntegrationService()

    if (isAdmin) {
        // 1. Cancel active LemonSqueezy subscription + delete customer
        const subscription = await ctx.db.subscription.findOne({ orgId: ctx.orgId, status: "active" })

        if (subscription?.subscriptionId) {
            await cancelSubscription(subscription.subscriptionId).catch((err) => {
                console.warn("[deleteUser] Failed to cancel LS subscription:", err?.message)
            })
        }

        // 2. Revoke integrations, wipe storage, bulk delete all DB records
        await Promise.all([
            integrationService.removeAllForOrg(ctx.orgId),
            storageService.deleteOrgFiles(ctx.orgId),
            ctx.db.invoiceExtractionRequest.deleteMany({ orgId: ctx.orgId }),
            ctx.db.invoice.deleteMany({ orgId: ctx.orgId }),
            ctx.db.vendor.deleteMany({ orgId: ctx.orgId }),
            ctx.db.scan.deleteMany({ orgId: ctx.orgId }),
            ctx.db.subscription.deleteMany({ orgId: ctx.orgId }),
        ])

        // 3. Delete ALL memberships for this org from Clerk
        const { data: orgMemberships } = await clerk.organizations.getOrganizationMembershipList({
            organizationId: ctx.orgId,
        })

        await Promise.all(
            orgMemberships.map((m) =>
                clerk.organizations.deleteOrganizationMembership({
                    organizationId: ctx.orgId ?? "",
                    userId: m.publicUserData?.userId ?? "",
                }).catch((err) => {
                    console.warn("[deleteUser] Failed to remove membership for:", m.publicUserData?.userId, err?.message)
                })
            )
        )

        // 4. Delete organization from Clerk and DB
        await Promise.all([
            clerk.organizations.deleteOrganization(ctx.orgId),
            ctx.db.organization.findOneAndDelete({ clerkOrgId: ctx.orgId }),
        ])

        // 5. Delete user from Clerk and DB
        await Promise.all([
            clerk.users.deleteUser(input.userId),
            ctx.db.user.findOneAndDelete({ clerkUserId: input.userId }),
        ])

    } else {
        // 1. Revoke tokens and integrations for this user only
        await integrationService.removeAllForUser(ctx.orgId, input.userId)

        // 2. Remove this user's membership from Clerk
        const userMembership = memberships.find((m) => m.organization.id === ctx.orgId)
        if (userMembership) {
            await clerk.organizations.deleteOrganizationMembership({
                organizationId: ctx.orgId,
                userId: input.userId,
            })
        }

        // 3. Delete user from DB and Clerk
        await Promise.all([
            clerk.users.deleteUser(input.userId),
            ctx.db.user.findOneAndDelete({ clerkUserId: input.userId }),
        ])
    }
}