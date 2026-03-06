import { AppRole } from "@snappin/shared/apps/app.schema";
import { trpc } from "@snappin/features/trpc/react/client";

export const useIntegration = ({
  connectedEmailAccounts: fetchEmailAccounts,
  connectedMobileScanners: fetchMobileScanners,
}: {
  connectedEmailAccounts?: boolean;
  connectedMobileScanners?: boolean;
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

  return {
    connectedEmailAccounts: emailAccountsQuery.data,
    connectedMobileScanners: mobileScannerQuery.data,
    isLoading: emailAccountsQuery.isLoading || mobileScannerQuery.isLoading,
    isFetching: emailAccountsQuery.isFetching || mobileScannerQuery.isFetching,
    error: emailAccountsQuery.error ?? mobileScannerQuery.error,
    refetch: () => {
      emailAccountsQuery.refetch();
      mobileScannerQuery.refetch();
    },
  };
};