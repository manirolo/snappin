"use client"

import {  useOrganizationList } from "@clerk/nextjs"
import { useFullScreenLoading } from "@snappin/ui/hooks/useGlobalLoader"
import toast from "react-hot-toast"

export function useSwitchOrganization() {
  const { show, clear } = useFullScreenLoading();
  const { setActive, userMemberships } = useOrganizationList();

  const switchOrganization = async (id: string | null) => {
    if (!setActive) {
      toast.error("Unable to switch organization");
      return;
    }
    const org = userMemberships?.data?.find((m) => m.organization.id === id);
    show({
      title: `Switching to ${org?.organization.name ?? "Personal Organization"}`,
      logo: org?.organization.imageUrl ?? undefined,
    });

    try {
      await setActive({ organization: org?.organization.id ?? null });
    } catch {
      toast.error("Failed to switch organization");
    } finally {
      clear();
    }
  };

  return { switchOrganization };
}