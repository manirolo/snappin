"use client"

import { useOrganization as Org, useOrganizationList } from "@clerk/nextjs"
import { useFullScreenLoading } from "@snappin/ui/hooks/useGlobalLoader"
import toast from "react-hot-toast"

export function useLeaveOrganization() {
  const { organization } = Org();
  const { userMemberships, setActive } = useOrganizationList({
    userMemberships: true,
  });

  const { show, clear } = useFullScreenLoading();

  const leaveOrganization = async () => {
    if (!organization) return;

    const membership = userMemberships?.data?.find(
      (m) => m.organization.id === organization.id,
    );

    if (!membership) {
      toast.error("Membership not found");
      return;
    }

    if (membership.role === "org:owner") {
      toast.error("Transfer ownership before leaving");
      return;
    }

    show({
      title: `Leaving ${organization.name}`,
      logo: organization.imageUrl ?? undefined,
    });

    try {
      if (!setActive) return;
      await membership.destroy();
      setActive({ organization: null });
      toast.success(`Left ${organization.name}`);
    } catch {
      toast.error("Failed to leave organization");
    } finally {
      clear();
    }
  };

  return { leaveOrganization };
}
