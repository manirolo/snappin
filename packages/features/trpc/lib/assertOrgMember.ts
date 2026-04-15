// lib/auth/assertOrgMember.ts
import { TRPCError } from "@trpc/server"
import { clerk } from "../config/clerk"

/**
 * Asserts that the given userId belongs to the given orgId.
 * Throws a TRPCError if not authenticated or not a member.
 */
export async function assertOrgMember({
    userId,
    orgId,
}: {
    userId: string | null | undefined
    orgId: string | null | undefined
}): Promise<void> {
    if (!userId || !orgId) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Authentication required" })
    }

    let isMember = false
    try {
        const { data: memberships } = await clerk.users.getOrganizationMembershipList({ userId })
        isMember = memberships.some((m) => m.organization.id === orgId)
    } catch {
        throw new TRPCError({ code: "FORBIDDEN", message: "You are not a member of this organization" })
    }

    if (!isMember) {
        throw new TRPCError({ code: "FORBIDDEN", message: "You are not a member of this organization" })
    }
}