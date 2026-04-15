// router/organization/inviteMember.handler.ts
import { clerk } from "../../config/clerk"
import { ContextProps } from "../../_trpc"
import { env } from "@snappin/env"

export type InviteMember = {
    ctx: ContextProps
}

export async function inviteMember({ ctx }: InviteMember) {
    if (!ctx.orgId) throw new Error("No org context")

    const invitation = await clerk.organizations.createOrganizationInvitation({
        organizationId: ctx.orgId,
        emailAddress: "", // not needed — we just need the token
        role: "org:member",
        redirectUrl: `${env.app.frontend_url}/accept-invite`,
    })

    // Build shareable link
    const inviteLink = `${env.app.frontend_url}/accept-invite?token=${invitation.id}`

    return { inviteLink }
}