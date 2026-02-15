"use client";

import { ReactNode, useEffect, useState } from "react";
import {
  getCoreRowModel,
  getSortedRowModel,
  PaginatedTable,
  SortingState,
  useReactTable,
} from "@snappin/ui/components/table";
import { invoiceColumns } from "./invoice.column";
import { toast } from "react-hot-toast";
import { NewScanDialog } from "../../../retroSearch/components/newScanDialog";
import { useInvoices } from "../../hooks/useInvoices";

const InvoiceEmptyActions = () => {
  return (
    <div className="flex flex-col gap-2">
      <NewScanDialog />
    </div>
  );
};

export const InvoiceListTable = ({ toolbar } : {toolbar?: ReactNode}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { invoices, error } = useInvoices()

  useEffect(() => {
    if (error) {
      toast.error("Something went wrong!");
    }
  }, [error]);

  const invoiceTable = useReactTable({
    data: invoices?.data ?? [],
    columns: invoiceColumns(),
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
    <div className="w-full">
      <PaginatedTable
        table={invoiceTable}
        pagination={{
          page: invoices?.page ?? page,
          totalPages: invoices?.totalPages ?? 1,
          limit: invoices?.limit ?? limit,
          hasNextPage: invoices?.hasNextPage ?? false,
          hasPrevPage: invoices?.hasPrevPage ?? false,
        }}
        next={() => setPage((p) => p + 1)}
        prev={() => setPage((p) => Math.max(1, p - 1))}
        changeLimit={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
        toolbar={toolbar}
        emptyTitle="Drag & Drop invoices"
        emptyDescription="Click here to choose invoice documents or just drag and drop invoices"
        emptyAction={<InvoiceEmptyActions />}
      />
    </div>
  );
};
