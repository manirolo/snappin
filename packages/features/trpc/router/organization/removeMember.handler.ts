import { clerk } from "../../config/clerk"
import { ContextProps } from "../../_trpc"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { IntegrationService } from "@snappin/features/integration/services/integration.service"
import { resend } from "@snappin/features/config/resend"
import { IS_PRODUCTION } from "@snappin/env"

export const ZRemoveMemberInput = z.object({
    userId: z.string(),
})

export type TRemoveMemberInput = z.infer<typeof ZRemoveMemberInput>

export type RemoveMember = {
    ctx: ContextProps
    input: TRemoveMemberInput
}

export async function removeMember({ ctx, input }: RemoveMember) {
    if (!ctx.orgId) {
        throw new TRPCError({ message: "Missing org context", code: "BAD_REQUEST" })
    }

    const { db } = await import("@snappin/db/index")
    const integrationService = new IntegrationService()

    // 1. Revoke + delete all integrations for this user in this org
    await integrationService.removeAllForUser(ctx.orgId, input.userId);

    const user = await ctx.db.user.findOne({ clerkUserId: input.userId })

    if (user && user.email && IS_PRODUCTION) {
        await resend.contacts.remove({ email: user?.email })
    }

    // 2. Remove membership from clerk
    await clerk.organizations.deleteOrganizationMembership({
        organizationId: ctx.orgId,
        userId: input.userId,
    })

    // 3. Delete user from clerk and db
    await Promise.all([
        clerk.users.deleteUser(input.userId),
        db.user.findOneAndDelete({ clerkUserId: input.userId }),
    ])
}