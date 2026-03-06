"use client";

import { ReactNode, useEffect, useState, useMemo, useCallback } from "react";
import {
  getCoreRowModel,
  getSortedRowModel,
  PaginatedTable,
  SortingState,
  useReactTable,
} from "@snappin/ui/components/table";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@snappin/ui/components/empty";
import { invoiceColumns, InvoiceRow } from "./invoice.column";
import { toast } from "react-hot-toast";
import { useInvoices } from "../../hooks/useInvoices";
import { Icon } from "@iconify/react";
import { useInvoiceProcessingStore } from "../invoiceProcessing.store";
import {
  FloatingTableToolbar,
  type FloatingToolbarAction,
} from "@snappin/ui/components/floatingToolbar";
import { trpc } from "@snappin/features/trpc/react/client";
import { useConfirmStore } from "@snappin/ui/components/alert/fn/store";
import { Spinner } from "@snappin/ui/assets/svg/spinner";
import { InvoiceDetailSheet } from "../sheet/invoiceDetail.sheet";
import { useRouter } from "next/navigation"

type EmptyInvoiceStateProps = { processingStatus: boolean };

const EmptyInvoiceStateComponent = ({
  processingStatus,
}: EmptyInvoiceStateProps) => (
  <Empty>
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <Icon icon="tabler:invoice" />
      </EmptyMedia>
      <EmptyTitle>No documents found</EmptyTitle>
      <EmptyDescription>
        Capture, extract and categorize bills, receipts and more in seconds
      </EmptyDescription>
      {processingStatus && (
        <EmptyContent>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Spinner className="size-4" />
            Processing uploaded documents. Just a moment
          </div>
        </EmptyContent>
      )}
    </EmptyHeader>
  </Empty>
);

export const InvoiceListTable = ({
  toolbar,
  search = "",
  onRowClick,
}: {
  toolbar?: ReactNode;
  search?: string;
  onRowClick?: (invoiceId: string) => void;
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const router = useRouter();

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const processingStatus = useInvoiceProcessingStore((s) => s.processingStatus);
  const openConfirm = useConfirmStore((s) => s.openConfirm);

  const [openInvoiceEditDialog, setOpenInvoiceEditDialog] =
    useState<boolean>(false);

  const utils = trpc.useUtils();
  const { invoices, isLoading, error, setLimit, setPage, page, limit } =
    useInvoices();

  useEffect(() => {
    if (error) toast.error("Something went wrong!");
  }, [error]);

  const columns = useMemo(() => invoiceColumns(), []);
  const rawData = useMemo(() => invoices?.data ?? [], [invoices?.data]);

  const data = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rawData;
    return rawData.filter((row) => {
      const vendorName = row.vendor?.name?.toLowerCase() ?? "";
      const total = row.invoice?.total?.toString() ?? "";
      const invoiceRecipient =
        row.invoice?.recipient?.name?.toLowerCase() ?? "";
      return (
        vendorName.includes(q) ||
        total.includes(q) ||
        invoiceRecipient.includes(q)
      );
    });
  }, [rawData, search]);

  const invoiceTable = useReactTable({
    data,
    columns,
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

  // Calling invoiceTable.getSelectedRowModel().rows during render triggers an
  // internal TanStack Table memoization that calls setState synchronously on
  // the first render — before React considers the component mounted.
  //
  // rowSelection keys are the row index as a string ("0", "1", "2"...).
  // We map selected indices back to the original data rows to get the ids.
  const selectedIds = useMemo(
    () =>
      Object.entries(rowSelection)
        .filter(([, selected]) => selected)
        .map(([index]) => data[Number(index)]?._id)
        .filter((id): id is string => Boolean(id)),
    [data, rowSelection],
  );

  const selectedCount = useMemo(
    () => Object.values(rowSelection).filter(Boolean).length,
    [rowSelection],
  );

  const clearSelection = useCallback(() => setRowSelection({}), []);

  const deleteInvoices = trpc.invoices.bulkInvoiceDelete.useMutation({
    onSuccess: () => {
      toast.success("Invoices deleted successfully");
      clearSelection();
      utils.invoices.getInvoices.invalidate();
    },
    onError: () => {
      toast.error("Failed to delete invoices");
    },
  });

  const handleDelete = useCallback(() => {
    if (selectedIds.length === 0) return;
    openConfirm({
      title: "Delete invoices",
      description:
        "Are you sure you want to delete these invoices? This cannot be undone.",
      confirmLabel: "Delete",
      destructive: true,
      size: "sm",
      onConfirm: () => deleteInvoices.mutate({ invoiceIds: selectedIds }),
    });
  }, [selectedIds, openConfirm, deleteInvoices]);

  const handleExport = useCallback(() => {
    console.log("Export", selectedIds);
  }, [selectedIds]);

  const handleMerge = useCallback(() => {
    console.log("Merge", selectedIds);
  }, [selectedIds]);

  const handleMarkPaid = useCallback(() => {
    console.log("Mark paid", selectedIds);
    clearSelection();
  }, [selectedIds, clearSelection]);

  // ── Floating toolbar actions ─────────────────────────────────────────────
  const floatingActions: FloatingToolbarAction[] = [
    {
      key: "mark-paid",
      label: "Mark as paid",
      icon: "lucide:circle-check",
      onClick: handleMarkPaid,
    },
    {
      key: "export",
      label: "Export",
      icon: "lucide:download",
      onClick: handleExport,
    },
    {
      key: "delete",
      label: "Delete",
      icon: "lucide:trash-2",
      onClick: handleDelete,
      destructive: true,
      loading: deleteInvoices.isPending,
    },
  ];

  const allInvoiceIds = useMemo(
    () => data.map((row) => row._id).filter(Boolean) as string[],
    [data],
  );

  // Update selectedInvoiceId to use index
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selectedInvoiceId =
    selectedIndex !== null ? allInvoiceIds[selectedIndex] : null;

  const isEmpty = !isLoading && (invoices?.data?.length ?? 0) <= 0;

  useEffect(() => {
    if (data.length > 0 && selectedIndex === null) {
      setSelectedIndex(0);

      if (onRowClick && data[0]?._id) {
        onRowClick(data[0]._id);
      }
    }
  }, [data, selectedIndex, onRowClick]);

  return (
    <div className="w-full">
      <PaginatedTable
        table={invoiceTable}
        loading={isLoading}
        pagination={{
          page: invoices?.page ?? page,
          totalPages: invoices?.totalPages ?? 1,
          limit: invoices?.limit ?? limit,
          hasNextPage: invoices?.hasNextPage ?? false,
          hasPrevPage: invoices?.hasPrevPage ?? false,
        }}
        onRowClick={(row) => {
          const id = row.original?._id;
          router.push("documents/" + id + "/edit")
        }}
        next={() => setPage((p) => p + 1)}
        prev={() => setPage((p) => Math.max(1, p - 1))}
        changeLimit={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
        toolbar={toolbar}
        processingStateText={
          processingStatus
            ? "Processing uploaded documents. Just a moment"
            : null
        }
        emptyStateComponent={
          isEmpty ? (
            <EmptyInvoiceStateComponent processingStatus={!!processingStatus} />
          ) : undefined
        }
      />

      <FloatingTableToolbar
        selectedCount={selectedCount}
        actions={floatingActions}
        onClear={clearSelection}
        noun="document"
      />
    </div>
  );
};
