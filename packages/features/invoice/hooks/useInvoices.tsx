"use client";

import { useState } from "react";
import { trpc } from "@snappin/features/trpc/react/client";
import { useInvoiceFilterStore } from "../components/filter/invoiceFilter.store";

export const useInvoices = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { vendorIds, senderEmails, recipientEmails, currencies, invoiceRecipients } = useInvoiceFilterStore();

  const query = trpc.invoices.getInvoices.useQuery(
    {
      page,
      limit,
      filters: {
        vendorIds: vendorIds.length ? vendorIds : undefined,
        senderEmails: senderEmails.length ? senderEmails : undefined,
        recipientEmails: recipientEmails.length ? recipientEmails : undefined,
        currencies: currencies.length ? currencies : undefined,
        invoiceRecipients: invoiceRecipients.length ? invoiceRecipients : undefined
      },
    },
    {
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
