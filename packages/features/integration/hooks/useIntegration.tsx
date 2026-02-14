import { trpc } from "@snappin/api/react/client";

export const useIntegration = ({ connectedSource, }: { connectedSource?: boolean;}) => {
  const query = trpc.integration.connectedSource.useQuery(
    undefined,
    {
      enabled: connectedSource === true, 
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );

  return {
    connectedSource: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
};
