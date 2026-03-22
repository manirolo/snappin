"use client";

import { useState, useEffect } from "react";
import {
  getCoreRowModel,
  getSortedRowModel,
  SimpleTable,
  SortingState,
  useReactTable,
} from "@snappin/ui/components/table";
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
import { useIntegration } from "@snappin/features/integration/hooks/useIntegration";

const EmptyMobileScannersStateComponent = () => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <HugeiconsIcon
            icon={SmartPhone01Icon}
            className="text-primary size-14"
          />
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

  const { connectedMobileScanners, error, isLoading } = useIntegration({
    connectedMobileScanners: true,
  });

  useEffect(() => {
    if (error) {
      toast.error("Something went wrong!");
    }
  }, [error]);

  const integrationTable = useReactTable({
    data: connectedMobileScanners ?? [],
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
      <SimpleTable
        table={integrationTable}
        // toolbar={toolbar}
        loading={isLoading}
        emptyStateComponent={<EmptyMobileScannersStateComponent />}
      />
    </div>
  );
};
