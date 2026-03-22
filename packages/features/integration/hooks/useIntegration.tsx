"use client";

import { AppRole, AppSlug } from "@snappin/shared/apps/app.schema";
import { trpc } from "@snappin/features/trpc/react/client";

export const useIntegration = ({
  connectedEmailAccounts: fetchEmailAccounts,
  connectedMobileScanners: fetchMobileScanners,
  integration: fetchIntegrations,
}: {
  connectedEmailAccounts?: boolean;
  connectedMobileScanners?: boolean;
  integration?: {
    enabled?: boolean;
    appSlug?: AppSlug;
    integrationId?: string;
  };
}) => {
  const emailAccountsQuery = trpc.integration.connectedSource.useQuery(
    { appRole: AppRole.EMAIL_SOURCE },
    {
      enabled: fetchEmailAccounts === true,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  );

  const mobileScannerQuery = trpc.integration.connectedSource.useQuery(
    { appRole: AppRole.MOBILE_SCANNER },
    {
      enabled: fetchMobileScanners === true,
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
    integration: integrationsQuery,
    isLoading:
      emailAccountsQuery.isLoading ||
      mobileScannerQuery.isLoading ||
      integrationsQuery.isLoading,
    isFetching:
      emailAccountsQuery.isFetching ||
      mobileScannerQuery.isFetching ||
      integrationsQuery.isFetching,
    error:
      emailAccountsQuery.error ??
      mobileScannerQuery.error ??
      integrationsQuery.error,
    refetch: () => {
      emailAccountsQuery.refetch();
      mobileScannerQuery.refetch();
      integrationsQuery.refetch();
    },
  };
};
