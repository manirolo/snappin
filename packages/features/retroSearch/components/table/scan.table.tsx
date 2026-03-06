"use client";

import { useState, useEffect } from "react";
import {
  getCoreRowModel,
  getSortedRowModel,
  PaginatedTable,
  SimpleTable,
  SortingState,
  useReactTable,
} from "@snappin/ui/components/table";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@snappin/ui/components/empty";
import { trpc } from "@snappin/features/trpc/react/client";
import { toast } from "react-hot-toast";
import { scanColumns } from "./scan.column";
import { Icon } from "@iconify/react"

const EmptyScanHistoryComponent = () => (
  <Empty>
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <Icon icon="tabler:invoice" />
      </EmptyMedia>
      <EmptyTitle>No scan history found</EmptyTitle>
      <EmptyDescription>
        Capture, extract and categorize bills, receipts and more in seconds
      </EmptyDescription>
    </EmptyHeader>
  </Empty>
);

export const ScanListTable = () => {
  // const [tab, setTab] = useState<IntegrationTab>("all");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const { data, isLoading, error } = trpc.retroSearch.getScans.useQuery(
    undefined,
    { refetchOnWindowFocus: false, refetchIntervalInBackground: false },
  );

  useEffect(() => {
    if (error) {
      toast.error("Something went wrong!");
    }
  }, [error]);

  const scansTable = useReactTable({
    data: data ?? [],
    columns: scanColumns(),
    state: { sorting, columnVisibility, rowSelection },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(rowSelection) : updater;
      setRowSelection(next);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
  });

  return (
    <div>
      <SimpleTable
        table={scansTable}
        // toolbar={toolbar}
        loading={isLoading}
        emptyStateComponent={<EmptyScanHistoryComponent />}
      />
    </div>
  );
};
