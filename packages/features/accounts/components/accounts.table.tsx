"use client";

import { useState, useEffect } from "react";
import {
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  SimpleTable,
} from "@snappin/ui/components/table";
import { trpc } from "@snappin/features/trpc/react/client";
import { toast } from "react-hot-toast";
import { accountsColumn } from "./account.column";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@snappin/ui/components/empty";
import { Icon } from "@iconify/react";

const EmptyConnectedAccountsStateComponent = () => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon icon={"mage:email"} />
        </EmptyMedia>
        <EmptyTitle>No email accounts yet</EmptyTitle>
        <EmptyDescription>
          Capture, extract and categorize bills, receipts and more in seconds
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};

// type IntegrationTab = "all" | "own" | "guest";

export const AccountsListTable = ({
  onRowClick,
}: {
  onRowClick?: (invoiceId: string) => void;
}) => {
  // const [tab, setTab] = useState<IntegrationTab>("all");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const { data, isLoading, error } =
    trpc.integration.connectedEmailAccounts.useQuery(undefined, {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    });

  useEffect(() => {
    if (error) {
      toast.error("Something went wrong!");
    }
  }, [error]);

  const integrationTable = useReactTable({
    data: data ?? [],
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

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (data && data?.length > 0 && selectedIndex === null) {
      setSelectedIndex(0);

      if (onRowClick && data[0]?._id) {
        onRowClick(data[0]._id);
      }
    }
  }, [data, selectedIndex, onRowClick]);

  return (
    <div>
      <SimpleTable
        table={integrationTable}
        // toolbar={toolbar}

        selectedRowIndex={selectedIndex}
        onRowClick={(row) => {
          const id = row.original?._id;
          const index = row.index;
          setSelectedIndex(index);
          if (onRowClick && id) {
            onRowClick(id);
          }
        }}
        loading={isLoading}
        emptyStateComponent={<EmptyConnectedAccountsStateComponent />}
      />
    </div>
  );
};
