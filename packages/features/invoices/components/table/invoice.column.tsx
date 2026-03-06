"use client";

import { SortableHeader, type ColumnDef } from "@snappin/ui/components/table";
import { Checkbox } from "@snappin/ui/components/checkbox";
import type { RouterOutputs } from "@snappin/features/trpc/_root";
import { cn } from "@snappin/ui/lib/utils";
import currencyMap from "currency-symbol-map";
import { formatDate } from "@snappin/lib/date/formateDate";
import { formatMinorAmount } from "@snappin/lib/amount/formatMinorAmount";
import { SupplierCell } from "./components/supplier";
import { SourceKind } from "@snappin/shared/apps/app.schema";
import { getDomainFromEmail } from "../../utils/getDomainFromEmail";
import { InvoiceActions } from "../invoiceActions";
import { HiDotsHorizontal } from "react-icons/hi";
import { Button } from "@snappin/ui/components/button";
import { InvoiceExtractionRequestResource } from "@snappin/shared/invoiceExtractRequest/invoiceExtractionRequest.schema";
import { Badge } from "@snappin/ui/components/badge";
import { Image } from "@snappin/ui/components/Image";
import { HiOutlineUpload } from "react-icons/hi";
import { appMetadata } from "@snappin/apps/app.metadata";

export type InvoiceRow =
  RouterOutputs["invoices"]["getInvoices"]["data"][number];

function AmountCell({
  currency,
  amount,
  muted,
}: {
  currency?: string | null;
  amount?: number | null;
  muted?: boolean;
}) {
  if (amount == null) return <span className="text-muted-foreground">—</span>;
  const symbol = currencyMap(currency ?? "usd") ?? "$";
  return (
    <span className={cn(muted && "text-muted-foreground text-xs")}>
      {symbol}
      {formatMinorAmount(amount)}
    </span>
  );
}
type ExtractionRow = RouterOutputs["invoices"]["getInvoices"]["data"][number]["extraction"];

function SourceCell({
  extraction,
}: {
  extraction: ExtractionRow;
}) {
  if (!extraction) return <span className="text-muted-foreground">—</span>;

  const isManual = extraction.source.kind === "manual";
  const slug = isManual ? null : extraction?.integration?.appSlug;

  return (
    <Badge
      variant="outline"
      className="gap-1.5 size-6 rounded-full text-xs font-medium border flex items-center justify-center"
      title={
        isManual
          ? "Manually uploaded"
          : slug
            ? appMetadata[slug]?.name
            : undefined
      }
    >
      {isManual ? (
        <HiOutlineUpload className="size-3.5 text-muted-foreground shrink-0" />
      ) : (
        slug &&
        appMetadata[slug]?.logoUrl && (
          <span className="size-3.5 shrink-0 flex items-center">
            props
            <Image
              src={appMetadata[slug].logoUrl}
              alt={slug}
              className="size-3.5 object-contain"
            />
          </span>
        )
      )}
    </Badge>
  );
}

export const invoiceColumns = (): ColumnDef<InvoiceRow>[] => [
  {
    id: "_id",
    size: 10,
    header: ({ table }) => (
      <Checkbox
        className="border-gray-200 cursor-pointer size-4"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="border-gray-200 bg-background size-4 cursor-pointer"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        onClick={(e) => e.stopPropagation()}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  // ✅ Invoice Date moved to end
  {
    accessorKey: "datetime",
    size: 20,
    header: ({ column }) => (
      <SortableHeader column={column} title="Invoice Date" />
    ),
    sortingFn: "datetime",
    cell: ({ row }) => {
      const date = row.original?.invoiceDate;
      return (
        <div className="w-full">
          {date ? (
            <span>{formatDate("MMM_DD_YYYY", date)}</span>
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </div>
      );
    },
  },

  {
    id: "source",
    header: "Source",
    size: 40,
    minSize: 60,
    cell: ({ row }) => <SourceCell extraction={row.original.extraction} />,
  },
  {
    id: "from",
    size: 220,
    minSize: 160,
    header: ({ column }) => <SortableHeader column={column} title="From" />,
    accessorFn: (row) => row.vendor?.name ?? "",
    sortingFn: "alphanumeric",
    cell: ({ row }) => (
      <SupplierCell
        subscription={
          row.original?.metadata?.subscription?.isRecurring ?? false
        }
        invoiceId={row.original?._id ?? ""}
        vendorName={row.original?.vendor?.name}
        senderAddress={
          row.original?.extraction?.source?.kind === SourceKind.INTEGRATION &&
          row.original?.extraction?.source?.metadata?.from
            ? getDomainFromEmail(row.original.extraction.source.metadata.from)
            : row.original?.vendor?.name
        }
      />
    ),
  },

  {
    id: "refId",
    header: "Reference Id",
    size: 20,
    cell: ({ row }) => <span>{row.original?.invoiceId}</span>,
  },
  {
    id: "category",
    header: "Category",
    size: 40,
    minSize: 60,
    cell: () => <span>-</span>,
  },
  {
    accessorKey: "invoice.tax",
    size: 120,
    header: ({ column }) => <SortableHeader column={column} title="Tax" />,
    sortingFn: "basic",
    cell: ({ row }) => (
      <div className="w-full">
        <AmountCell
          currency={row.original?.currency}
          amount={row.original?.tax?.taxAmount ?? 0}
        />
      </div>
    ),
  },
  {
    accessorKey: "invoice.total",
    size: 120,
    header: ({ column }) => (
      <SortableHeader column={column} title="Total Amount" />
    ),
    sortingFn: "basic",
    cell: ({ row }) => (
      <div className="w-full">
        <AmountCell
          currency={row.original?.currency}
          amount={row.original?.total}
        />
      </div>
    ),
  },

  {
    id: "actions",
    header: "Actions",
    size: 20,
    cell: ({ row }) => (
      <div className="flex justify-start">
        <InvoiceActions invoiceId={row.original?._id ?? ""}>
          <Button variant="ghost" size="sm">
            <HiDotsHorizontal />
          </Button>
        </InvoiceActions>
      </div>
    ),
  },
];
