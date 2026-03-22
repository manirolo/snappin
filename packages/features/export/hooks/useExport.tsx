"use client";

import { trpc } from "@snappin/features/trpc/react/client";

export const useExport = () => {
  const query = trpc.export.getExportIntegrations.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    staleTime: Infinity,
    retry: 1,
  });

  return {
    exportIntegrations: query.data,

    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
  };
};
