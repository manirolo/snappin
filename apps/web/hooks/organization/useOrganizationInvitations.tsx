"use client"

import { useOrganizationList } from "@clerk/nextjs"
import { useFullScreenLoading } from "@snappin/ui/hooks/useGlobalLoader"
import toast from "react-hot-toast"

export function useOrganizationInvitations() {
  const { userInvitations } = useOrganizationList({
    userInvitations: true,
  });

  const { show, clear } = useFullScreenLoading();

  const invitations = userInvitations?.data ?? [];

  const acceptInvitation = async (invitationId: string) => {
    const invitation = invitations.find((i) => i.id === invitationId);
    if (!invitation) return;

    show({
      title: `Joining ${invitation?.publicOrganizationData.name}`,
      logo: invitation.publicOrganizationData.imageUrl ?? undefined,
    });

    try {
      await invitation.accept();
      toast.success(`Joined ${invitation.publicOrganizationData.name}`);
    } catch {
      toast.error("Failed to accept invitation");
    } finally {
      clear();
    }
  };

  return {
    invitations,
    acceptInvitation,
  };
}
