"use client";

import { trpc } from "@snappin/features/trpc/react/client";

export const useRetroSearch = () => {
  const query = trpc.retroSearch.getScans.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    staleTime: Infinity,
    retry: 1,
  });

  return {
    retroSearchHistory: query.data,

    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
  };
};
