"use client";

import { useState, useEffect } from "react";
import {
  getCoreRowModel,
  getSortedRowModel,
  PaginatedTable,
  SortingState,
  useReactTable,
} from "@snappin/ui/components/table";
import { trpc } from "@snappin/features/trpc/react/client";
import { toast } from "react-hot-toast";
import { accountsColumn } from "./mobileScanners.column";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@snappin/ui/components/empty";
import { HugeiconsIcon } from "@hugeicons/react";
import { SmartPhone01Icon } from "@hugeicons-pro/core-bulk-rounded";

const EmptyMobileScannersStateComponent = () => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <HugeiconsIcon icon={SmartPhone01Icon} className="text-primary size-14" />
        </EmptyMedia>
        <EmptyTitle>No mobile scanners yet</EmptyTitle>
        <EmptyDescription>
          Capture, extract and categorize bills, receipts and more in seconds
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};

// type IntegrationTab = "all" | "own" | "guest";

export const MobileScannersListTable = () => {
  // const [tab, setTab] = useState<IntegrationTab>("all");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading, error } =
    trpc.integration.connectedMobileScanners.useQuery(
      { page, limit },
      { refetchOnWindowFocus: false, refetchIntervalInBackground: false },
    );

  useEffect(() => {
    if (error) {
      toast.error("Something went wrong!");
    }
  }, [error]);

  const integrationTable = useReactTable({
    data: data?.data ?? [],
    columns: accountsColumn(),
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
      <PaginatedTable
        table={integrationTable}
        pagination={{
          page: data?.page ?? page,
          totalPages: data?.totalPages ?? 1,
          limit: data?.limit ?? limit,
          hasNextPage: data?.hasNextPage ?? false,
          hasPrevPage: data?.hasPrevPage ?? false,
        }}
        next={() => setPage((p) => p + 1)}
        prev={() => setPage((p) => Math.max(1, p - 1))}
        // toolbar={toolbar}
        loading={isLoading}
        changeLimit={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
        emptyStateComponent={<EmptyMobileScannersStateComponent />}
      />
    </div>
  );
};
