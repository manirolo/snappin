"use client";

import { trpc } from "@snappin/features/trpc/react/client";

export const useUsage = () => {

  const query = trpc.billing.usage.useQuery(undefined,
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
      retry: 1,
    },
  );

  return {
    usage: query.data,

    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
  };
};
