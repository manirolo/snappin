"use client";

import { useState, useEffect } from "react";
import {
  getCoreRowModel,
  getSortedRowModel,
  SimpleTable,
  SortingState,
  useReactTable,
} from "@snappin/ui/components/table";
import { trpc } from "@snappin/features/trpc/react/client";
import { toast } from "react-hot-toast";
import { scanColumn } from "./scan.column";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@snappin/ui/components/empty";
import { HugeiconsIcon } from "@hugeicons/react";
import { SmartPhone01Icon } from "@hugeicons-pro/core-bulk-rounded";

const EmptyScanHistoryStateComponent = () => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <HugeiconsIcon
            icon={SmartPhone01Icon}
            className="text-primary size-14"
          />
        </EmptyMedia>
        <EmptyTitle>No scans yet</EmptyTitle>
        <EmptyDescription>
          Capture, extract and categorize bills, receipts and more in seconds
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};

// type IntegrationTab = "all" | "own" | "guest";

export const ScanListTable = () => {
  // const [tab, setTab] = useState<IntegrationTab>("all");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const { data, isLoading, error } =
    trpc.retroSearch.getScans.useQuery(
      undefined,
      { refetchOnWindowFocus: false, refetchIntervalInBackground: false },
    );

  useEffect(() => {
    if (error) {
      toast.error("Something went wrong!");
    }
  }, [error]);

  const scanTable = useReactTable({
    data: data ?? [],
    columns: scanColumn(),
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
        table={scanTable}
        // toolbar={toolbar}
        loading={isLoading}
        emptyStateComponent={<EmptyScanHistoryStateComponent />}
      />
    </div>
  );
};
