"use client";

import {
  ReactNode,
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
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
import { invoiceColumns } from "./invoice.column";
import { toast } from "react-hot-toast";
import { useInvoices } from "../../hooks/useInvoices";
import { useInvoiceProcessingStore } from "../invoiceProcessing.store";
import {
  FloatingTableToolbar,
  type FloatingToolbarAction,
} from "@snappin/ui/components/floatingToolbar";
import { trpc } from "@snappin/features/trpc/react/client";
import { useConfirmStore } from "@snappin/ui/components/alert/fn/store";
import { Spinner } from "@snappin/ui/assets/svg/spinner";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import { Happy01Icon } from "@hugeicons-pro/core-bulk-rounded";
import { FilterInvoice } from "../filter/filterByCategory";
import { ExportAll } from "@snappin/features/export/components/exportAll";
import { Input, InputWrapper } from "@snappin/ui/components/input";
import { Icon } from "@iconify/react";
import { ManualInvoiceUploadDialog } from "../manualInvoiceUpload.dialog";
import { UsageStats } from "@snappin/features/billing/components/usageStats";
import { useUsage } from "@snappin/features/billing/hooks/useUsage";

type EmptyInvoiceStateProps = { processingStatus: boolean };

const EmptyInvoiceStateComponent = ({
  processingStatus,
}: EmptyInvoiceStateProps) => {
  const [openInvoiceUpload, setOpenInvoiceUpload] = useState<boolean>(false);

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <HugeiconsIcon icon={Happy01Icon} className="size-9" />
        </EmptyMedia>
        <EmptyTitle>No invoices</EmptyTitle>
        <EmptyDescription>
          Connect email accounts for automatic invoice extraction or upload a
          document
        </EmptyDescription>
        <EmptyContent>
          <div>
            {processingStatus && (
              <div className="flex items-center gap-2 mb-6 text-muted-foreground">
                <Spinner className="size-4" />
                Processing uploaded documents. Just a moment
              </div>
            )}
            <ManualInvoiceUploadDialog
              open={openInvoiceUpload}
              setOpen={setOpenInvoiceUpload}
            />
          </div>
        </EmptyContent>
      </EmptyHeader>
    </Empty>
  );
};

export const InvoiceListTable = ({
  onRowClick,
  // search,
}: {
  toolbar?: ReactNode;
  onRowClick?: (invoiceId: string) => void;
  search?: string;
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const router = useRouter();
  const [search, setSearch] = useState("");

  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/") {
        e.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const processingStatus = useInvoiceProcessingStore((s) => s.processingStatus);
  const openConfirm = useConfirmStore((s) => s.openConfirm);
  const [openInvoiceUpload, setOpenInvoiceUpload] = useState<boolean>(false);

  const utils = trpc.useUtils();
  const { invoices, isLoading, error, setLimit, setPage, page, limit } =
    useInvoices();
  const { usage } = useUsage();

  useEffect(() => {
    if (error) toast.error("Something went wrong!");
  }, [error]);

  const columns = useMemo(() => invoiceColumns(), []);
  const rawData = useMemo(() => invoices?.data ?? [], [invoices?.data]);

  const data = useMemo(() => {
    const q = search?.trim().toLowerCase();
    if (!q) return rawData;
    return rawData.filter((row) => {
      const vendorName = row.vendor?.name?.toLowerCase() ?? "";
      const total = row?.totals?.total?.toString() ?? "";
      const invoiceRecipient = row?.recipient?.name?.toLowerCase() ?? "";
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
    initialState: {
      sorting: [{ id: "datetime", desc: true }],
    },
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

  // const handleMerge = useCallback(() => {
  //   console.log("Merge", selectedIds);
  // }, [selectedIds]);

  // ── Floating toolbar actions ─────────────────────────────────────────────
  const floatingActions: FloatingToolbarAction[] = [
    {
      key: "export",
      trigger: <ExportAll selectedInvoiceIds={selectedIds} />,
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

  // Update selectedInvoiceId to use index
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

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
    <div className="w-full h-full">
      <PaginatedTable
        table={invoiceTable}
        toolbar={
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <InputWrapper className="max-w-60 border-0 h-8 shadow-none">
                <Icon icon="majesticons:search-line" />
                <Input
                  ref={searchRef}
                  placeholder="Search for something"
                  className="placeholder:font-medium text-[13px]"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </InputWrapper>

              <FilterInvoice />
              <ExportAll />
            </div>
            <div className="flex items-center gap-2">
              {invoiceTable.getRowModel().rows.length > 0 && (
                <UsageStats
                  id="invoice"
                  label="Used"
                  usage={usage?.usage?.invoices ?? 0}
                  limit={usage?.limits?.invoices ?? 0}
                  enableWarnRunOutOfCredits
                />
              )}
              <ManualInvoiceUploadDialog
                open={openInvoiceUpload}
                setOpen={setOpenInvoiceUpload}
              />
            </div>
          </div>
        }
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
          router.push("/bookkeeping/documents/" + id + "/edit");
        }}
        next={() => setPage((p) => p + 1)}
        prev={() => setPage((p) => Math.max(1, p - 1))}
        changeLimit={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
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
