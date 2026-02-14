"use client";

import { useState } from "react";
import { trpc } from "@snappin/api/react/client";

export const useInvoices = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const query = trpc.invoices.getInvoices.useQuery(
    { page, limit },
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
      retry: 1,
    },
  );

  return {
    invoices: query.data,
    total: query.data?.total ?? 0,

    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,

    page,
    limit,
    setPage,
    setLimit,

    hasNextPage: query.data ? page * limit < query.data.total : false,

    refetch: query.refetch,
  };
};
