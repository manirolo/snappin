"use client"

import { useMemo } from "react"
import { useOrganization as Org, useOrganizationList } from "@clerk/nextjs"
import { OrganizationMembershipResource, OrganizationResource } from "@clerk/types"

type UseOrganizationResult = {
  activeOrg: OrganizationResource | null;
  organizations_with_active_org: OrganizationMembershipResource[];
  organizations_without_active_org: OrganizationResource[];
  canSwitchToPersonal: boolean;
  isLoaded: boolean;
};

export function useOrganization(): UseOrganizationResult {
  const { organization, isLoaded: orgLoaded } = Org();

  const { userMemberships, isLoaded: membershipsLoaded } =
    useOrganizationList({
      userMemberships: true,
    });

  const isLoaded = orgLoaded && membershipsLoaded;

  return useMemo(() => {
    if (!userMemberships?.data) {
      return {
        activeOrg: null,
        organizations_with_active_org: [],
        organizations_without_active_org: [],
        canSwitchToPersonal: false,
        isLoaded,
      };
    }

    const activeOrg = organization ?? null;
    const activeOrgId = activeOrg?.id ?? null;

    const organizations_without_active_org =
      userMemberships.data
        .map((m) => m.organization)
        .filter((o) => o.id !== activeOrgId);

    const canSwitchToPersonal =
      !organizations_without_active_org.length && !!activeOrg;

    return {
      activeOrg,
      organizations_with_active_org: userMemberships.data,
      organizations_without_active_org,
      canSwitchToPersonal,
      isLoaded,
    };
  }, [organization, userMemberships, isLoaded]);
}