// lib/auth/assertResourceAccess.ts
import { TRPCError } from "@trpc/server"
import { clerk } from "../config/clerk"

type MembershipRole = "org:admin" | "org:member" | (string & {})

/**
 * Asserts membership, then optionally checks org role or resource ownership.
 *
 * @example — member only
 * await assertResourceAccess({ userId, orgId })
 *
 * @example — org admin only
 * await assertResourceAccess({ userId, orgId, requireRole: "org:admin" })
 *
 * @example — owner of a resource OR org admin
 * await assertResourceAccess({ userId, orgId, resourceOwnerId: integration.userId })
 */
export async function assertResourceAccess({
    userId,
    orgId,
    requireRole,
    resourceOwnerId,
    clerkClient = clerk,
}: {
    userId: string | null | undefined
    orgId: string | null | undefined
    requireRole?: MembershipRole
    resourceOwnerId?: string | null
    clerkClient?: typeof clerk
}): Promise<{ role: MembershipRole }> {
    if (!userId || !orgId) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Authentication required" })
    }

    // ── Resolve membership + role ──────────────────────────────────────────────
    let role: MembershipRole | null = null

    try {
        const { data: memberships } = await clerkClient.users.getOrganizationMembershipList({ userId })
        const match = memberships.find((m) => m.organization.id === orgId)
        if (match) role = match.role
    } catch {
        throw new TRPCError({ code: "FORBIDDEN", message: "You are not a member of this organization" })
    }

    if (!role) {
        throw new TRPCError({ code: "FORBIDDEN", message: "You are not a member of this organization" })
    }

    const isAdmin = role === "org:admin"

    // ── Role gate ─────────────────────────────────────────────────────────────
    if (requireRole && role !== requireRole) {
        throw new TRPCError({
            code: "FORBIDDEN",
            message: `This action requires the '${requireRole}' role`,
        })
    }

    // ── Resource ownership gate (owner OR admin passes) ───────────────────────
    if (resourceOwnerId !== undefined) {
        const isOwner = resourceOwnerId === userId
        if (!isOwner && !isAdmin) {
            throw new TRPCError({
                code: "FORBIDDEN",
                message: "You do not have permission to access this resource",
            })
        }
    }

    return { role }
}