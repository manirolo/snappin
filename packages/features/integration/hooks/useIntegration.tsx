"use client";

import { AppRole, AppSlug } from "@snappin/shared/apps/app.schema";
import { trpc } from "@snappin/features/trpc/react/client";

export const useIntegration = ({
  connectedEmailAccounts: fetchEmailAccounts,
  connectedMobileScanners: fetchMobileScanners,
  connectedAllSources: fetchAllSources,
  integration: fetchIntegrations,
}: {
  connectedEmailAccounts?: boolean;
  connectedMobileScanners?: boolean;
  connectedAllSources?: boolean;
  integration?: {
    enabled?: boolean;
    appSlug?: AppSlug;
    integrationId?: string;
  };
}) => {
  const emailAccountsQuery = trpc.integration.connectedSource.useQuery(
    { appRoles: [AppRole.EMAIL_SOURCE] },
    {
      enabled: fetchEmailAccounts === true,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  );

  const mobileScannerQuery = trpc.integration.connectedSource.useQuery(
    { appRoles: [AppRole.MOBILE_SCANNER] },
    {
      enabled: fetchMobileScanners === true,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  );

  const allSourcesQuery = trpc.integration.connectedSource.useQuery(
    {},
    {
      enabled: fetchAllSources === true,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  );

  const integrationsQuery = trpc.integration.getIntegration.useQuery(
    {
      appSlug: fetchIntegrations?.appSlug,
      ...(fetchIntegrations?.integrationId && {
        integrationId: fetchIntegrations.integrationId,
      }),
    },
    {
      enabled: fetchIntegrations?.enabled === true,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  );

  return {
    connectedEmailAccounts: emailAccountsQuery.data,
    connectedMobileScanners: mobileScannerQuery.data,
    connectedAllSources: allSourcesQuery.data,
    integration: integrationsQuery,
    isLoading:
      emailAccountsQuery.isLoading ||
      mobileScannerQuery.isLoading ||
      allSourcesQuery.isLoading ||
      integrationsQuery.isLoading,
    isFetching:
      emailAccountsQuery.isFetching ||
      mobileScannerQuery.isFetching ||
      allSourcesQuery.isFetching ||
      integrationsQuery.isFetching,
    error:
      emailAccountsQuery.error ??
      mobileScannerQuery.error ??
      allSourcesQuery.error ??
      integrationsQuery.error,
    refetch: () => {
      emailAccountsQuery.refetch();
      mobileScannerQuery.refetch();
      allSourcesQuery.refetch();
      integrationsQuery.refetch();
    },
  };
};