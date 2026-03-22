import { useEffect, useRef } from "react";
import { trpc } from "@snappin/features/trpc/react/client";
import { TInvoiceProcessStatusResponse } from "@snappin/features/trpc/router/invoice/invoiceProcessStatus.schema";

type Options = {
  onStatus?: (status: TInvoiceProcessStatusResponse) => void;
};

export function useInvoiceProcessStatus(
  jobId: string | null,
  options?: Options,
) {
  const utils = trpc.useUtils();
  const { invalidate } = utils.invoices.getInvoices;
  const prevDone = useRef(false);
  const onStatusRef = useRef(options?.onStatus);
  const mounted = useRef(false); // ← add this

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    onStatusRef.current = options?.onStatus;
  });

  const query = trpc.invoices.invoiceProcessingStatus.useQuery(
    { jobId: jobId! },
    {
      enabled: !!jobId,
      refetchInterval: (query) => (query.state.data?.done ? false : 5000),
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  );

  useEffect(() => {
    if (!query.data || !mounted.current) return; // ← guard here

    onStatusRef.current?.(query.data);

    if (query.data.done && !prevDone.current) {
      prevDone.current = true;
      invalidate();
    }
  }, [query.data, invalidate]);

  return query;
}
