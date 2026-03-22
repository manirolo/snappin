"use client";

import { trpc } from "@snappin/features/trpc/react/client";

export const useAccounts = () => {

  const query = trpc.integration.connectedEmailAccounts.useQuery(undefined,
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
      retry: 1,
    },
  );

  return {
    accounts: query.data,

    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
  };
};
