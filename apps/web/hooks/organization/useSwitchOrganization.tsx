"use client";

import { useOrganizationList } from "@clerk/nextjs";
import toast from "react-hot-toast";

export function useSwitchOrganization() {
  const { setActive, userMemberships } = useOrganizationList();

  const switchOrganization = async (id: string | null) => {
    if (!setActive) {
      toast.error("Unable to switch organization");
      return;
    }
    const org = userMemberships?.data?.find((m) => m.organization.id === id);

    try {
      await setActive({ organization: org?.organization.id ?? null });
    } catch {
      toast.error("Failed to switch organization");
    }
  };

  return { switchOrganization };
}
