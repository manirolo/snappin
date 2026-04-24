"use client";

import { SortableHeader, type ColumnDef } from "@snappin/ui/components/table";
import { Checkbox } from "@snappin/ui/components/checkbox";
import type { RouterOutputs } from "@snappin/features/trpc/_root";
import currencyMap from "currency-symbol-map";
import { formatDate } from "@snappin/lib/date/formateDate";
import { formatMinorAmount } from "@snappin/lib/amount/formatMinorAmount";
import { SupplierCell } from "./components/supplier";
import { AppSlug, SourceKind } from "@snappin/shared/apps/app.schema";
import { IntegrationSnapshot } from "@snappin/shared/integration/integration.schema";
import { getDomainFromEmail } from "../../utils/getDomainFromEmail";
import { InvoiceActions } from "../invoiceActions";
import { HiDotsHorizontal } from "react-icons/hi";
import { Button } from "@snappin/ui/components/button";
import { Badge } from "@snappin/ui/components/badge";
import { Image } from "@snappin/ui/components/Image";
import { HiOutlineUpload } from "react-icons/hi";
import { appMetadata } from "@snappin/apps/app.metadata";
import { InvoiceResource } from "@snappin/shared/invoice/invoice.schema";

export type InvoiceRow =
  RouterOutputs["invoices"]["getInvoices"]["data"][number];

function AmountCell({
  currency,
  amount,
  // muted,
}: {
  currency?: string | null;
  amount?: number | null;
  muted?: boolean;
}) {
  if (amount == null) return <span className="text-muted-foreground">—</span>;
  const symbol = currencyMap(currency ?? "usd") ?? "$";
  return (
    <span className="tracking-wide">
      {symbol}
      {formatMinorAmount(amount)}
    </span>
  );
}
type ExtractionRow =
  RouterOutputs["invoices"]["getInvoices"]["data"][number]["extraction"];

function SourceCell({
  extraction,
}: {
  extraction: ExtractionRow;
  integrationSnapshot?: IntegrationSnapshot;
}) {
  if (!extraction) return <span className="text-muted-foreground">—</span>;

  const isManual = extraction.source.kind === "manual";
  const slug = !isManual
    ? (extraction._integration?.appSlug as AppSlug | null | undefined)
    : null;

  return (
    <div className="flex justify-start">
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
              <Image
                src={appMetadata[slug].logoUrl}
                alt={slug}
                className="size-3.5 object-contain"
              />
            </span>
          )
        )}
      </Badge>
    </div>
  );
}

export const invoiceColumns = (): ColumnDef<InvoiceRow>[] => [
  {
    id: "_id",
    size: 30,
    minSize: 30,
    header: ({ table }) => (
      <div className="flex pr-2 justify-start">
        <Checkbox
          className="border-gray-200 cursor-pointer size-4"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex pr-2 justify-start">
        <Checkbox
          className="border-gray-200 bg-background size-4 cursor-pointer"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
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
        description={row.original?.description}
        senderAddress={
          row.original?.extraction?.source?.kind === SourceKind.INTEGRATION &&
          row.original?.extraction?.source?.metadata?.from
            ? getDomainFromEmail(row.original.extraction.source.metadata.from)
            : row.original?.vendor?.website ?? row.original?.vendor?.name
        }
      />
    ),
  },
  {
    id: "source",
    header: () => <span className="flex justify-start">Source</span>,
    size: 40,
    minSize: 60,
    cell: ({ row }) => <SourceCell extraction={row.original.extraction} />,
  },
  {
    accessorKey: "invoice.total",
    size: 50,
    minSize: 40,
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Total Amount"
        className="justify-start pr-12"
      />
    ),
    sortingFn: "basic",
    cell: ({ row }) => (
      <div className="w-full text-start pr-12">
        <AmountCell
          currency={row.original?.totals?.currency}
          amount={row.original?.totals?.total ?? 0}
        />
      </div>
    ),
  },

  // ✅ Invoice Date moved to end
  {
    accessorKey: "datetime",
    size: 20,
    minSize: 30,
    header: ({ column }) => <SortableHeader column={column} title="Date" />,
    sortingFn: (rowA, rowB) => {
      const a = rowA.original?.invoiceDate ?? "";
      const b = rowB.original?.invoiceDate ?? "";
      return a < b ? -1 : a > b ? 1 : 0;
    },
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
    id: "actions",
    header: () => <div className="w-full text-end">Actions</div>,
    size: 120,
    cell: ({ row }) => (
      <div className="flex justify-end pr-2">
        <InvoiceActions
          invoiceId={row.original?._id ?? ""}
          invoice={row.original as unknown as InvoiceResource}
        >
          <Button variant="ghost" size="sm">
            <HiDotsHorizontal />
          </Button>
        </InvoiceActions>
      </div>
    ),
  },
];
