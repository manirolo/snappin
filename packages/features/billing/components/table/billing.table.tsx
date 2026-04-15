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
import { billingColumn } from "./billing.column";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@snappin/ui/components/empty";
import { HugeiconsIcon } from "@hugeicons/react";
import { SmartPhone01Icon } from "@hugeicons-pro/core-stroke-rounded";
import { useIntegration } from "@snappin/features/integration/hooks/useIntegration";
import { ExtraSmall } from "@snappin/ui/components/typography";
import { Button } from "@snappin/ui/components/button";

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

export const BillingListTable = () => {
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
    columns: billingColumn(),
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
        toolbar={
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-1 justify-between items-start">
              <h6 className="font-medium">Mobile Source</h6>
              <ExtraSmall>Send your receipts through mobile</ExtraSmall>
            </div>
            <Button variant={"outline"} size="sm" >
              Add mobile Scanner
            </Button>
          </div>
        }
        loading={isLoading}
        emptyStateComponent={<EmptyMobileScannersStateComponent />}
      />
    </div>
  );
};
