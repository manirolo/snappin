"use client";

import { useState, useEffect } from "react";
import {
  getCoreRowModel,
  getSortedRowModel,
  PaginatedTable,
  SortingState,
  TableTabs,
  useReactTable,
} from "@snappin/ui/components/table";
import { trpc } from "@snappin/api/react/client";
import { toast } from "react-hot-toast";
import { integrationColumns } from "./integration.column";
import { Button } from "@snappin/ui/components/button";
import { CardTitle } from "@snappin/ui/components/card";
import { H5 } from "@snappin/ui/components/typography";

type IntegrationTab = "all" | "own" | "guest";

export const IntegrationListTable = () => {
  const [tab, setTab] = useState<IntegrationTab>("all");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading, error } = trpc.integration.getIntegration.useQuery(
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
    columns: integrationColumns(),
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

  const toolbar = (
    <div className="flex w-full items-center justify-between gap-4">
      <H5>Source</H5>
      <Button variant={"mono"} size={"sm"}>Add Source</Button>
    </div>
  );

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
        toolbar={toolbar}
        loading={isLoading}
        changeLimit={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
        emptyTitle="No apps connected yet!"
        emptyDescription="Connect apps or service with snappin"
      />
    </div>
  );
};
