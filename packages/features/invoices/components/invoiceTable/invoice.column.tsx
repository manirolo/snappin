"use client";

import { useState } from "react";
import { SortableHeader, type ColumnDef } from "@snappin/ui/components/table";

import { Checkbox } from "@snappin/ui/components/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@snappin/ui/components/dropdown-menu";

import type { RouterOutputs } from "@snappin/trpc/_root";
import { trpc } from "@snappin/trpc/react/client";

import { HugeiconsIcon } from "@hugeicons/react";
import { MoreHorizontalIcon } from "@hugeicons-pro/core-solid-rounded";
import { Icon } from "@iconify/react";

import toast from "react-hot-toast";
import { cn } from "@snappin/ui/lib/utils";
import { useConfirmStore } from "@snappin/ui/components/alert/fn/store";
import currencyMap from "currency-symbol-map"
import { Badge } from "@snappin/ui/components/badge";
import { formatDate } from "@snappin/lib/date/formateDate";
import { formatMinorAmount } from "@snappin/lib/formatMinorAmount";
import { SupplierCell } from "./components/supplier";

type InvoiceRow = RouterOutputs["invoices"]["getInvoices"]["data"][number];

type ActionKey = "sendTo" | "delete" | "xero" | "zoho";

type ActionConfig = {
  key: ActionKey;
  label: string;
  destructive?: boolean;
  children?: ActionConfig[];
};

const actionsConfig: ActionConfig[] = [
  {
    key: "sendTo",
    label: "Send to",
    children: [
      { key: "xero", label: "Add to Xero" },
      { key: "zoho", label: "Add to Zoho" },
    ],
  },
  {
    key: "delete",
    label: "Delete permanently",
    destructive: true,
  },
];

const ActionsCell = ({id,}: {id: string;}) => {
  const [activeAction, setActiveAction] = useState<ActionKey | null>(null);
  const utils = trpc.useUtils();
  const openConfirm = useConfirmStore((s) => s.openConfirm);

  const deleteInvoice =
    trpc.invoices.deleteInvoice.useMutation({
      onSuccess: async () => {
        toast.success("Invoice deleted successfully");
        setActiveAction(null);
        await utils.invoices.getInvoices.invalidate()
      },
      onError: () => {
        toast.error("Failed to delete invoice");
        setActiveAction(null);
      },
    });

  const actionHandlers: Record<ActionKey, () => void> = {
    sendTo: () => {},

    xero: () => {
      setActiveAction("xero");
      // TODO: call Xero mutation
    },

    zoho: () => {
      setActiveAction("zoho");
      // TODO: call Zoho mutation
    },

    delete: () => {
      openConfirm({
        // icon: <HugeiconsIcon icon={Delete01Icon} className="size-6"/>,
        title: "Delete invoice",
        description: "Are you sure that you want to delete these expenses?",
        confirmLabel: "Delete",
        destructive: true,
        size: "sm",
        onConfirm: () => {
          setActiveAction("delete");
          deleteInvoice.mutate({ invoiceId: id });
        },
      });
    },
  };

  const renderAction = (action: ActionConfig) => {
    const isLoading = activeAction === action.key;

    if (action.children?.length) {
      return (
        <DropdownMenuSub key={action.key}>
          <DropdownMenuSubTrigger className="h-9 text-sm">
            {action.label}
          </DropdownMenuSubTrigger>

          <DropdownMenuSubContent sideOffset={10} alignOffset={-10} className="min-w-44">
            {action.children.map(renderAction)}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      );
    }

    return (
      <DropdownMenuItem
        key={action.key}
        disabled={isLoading}
        className={cn("h-9 text-sm flex items-center gap-2",action.destructive &&"text-destructive data-highlighted:bg-red-50 data-highlighted:text-destructive")}
        onSelect={(e) => {
          e.preventDefault();
          actionHandlers[action.key]();
        }}
      >
        {isLoading && (
          <Icon
            icon="line-md:loading-twotone-loop"
            className="h-4 w-4"
          />
        )}
        {action.label}
      </DropdownMenuItem>
    );
  };

  // ✅ IMPORTANT: return JSX
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1">
          <HugeiconsIcon icon={MoreHorizontalIcon} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="right" align="start" sideOffset={6} className="min-w-44">
        {actionsConfig.map(renderAction)}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const invoiceColumns = (): ColumnDef<InvoiceRow>[] => [
  {
    id: "_id",
    header: ({ table }) => (
      <Checkbox className="border-gray-10"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() &&
            "indeterminate")
        }
        onCheckedChange={(value) =>
          table.toggleAllPageRowsSelected(!!value)
        }
      />
    ),
    cell: ({ row }) => (
      <div className="flex gap-2 items-center">
        <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) =>
          row.toggleSelected(!!value)
        }
      />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "Supplier",
    size: 240,
    minSize: 200,
    header: ({ column }) => (
    <SortableHeader column={column} title="Supplier" />
  ),
    accessorFn: (row) => row.vendorDoc?.aliasName ?? "",
    sortingFn: "alphanumeric",
    cell: ({ row }) => <SupplierCell subscription={row.original.invoice?.subscription?.isRecurring ?? false} invoiceId={row.original?._id ?? ""} vendorName={row.original?.vendorDoc?.aliasName ?? "Unknown supplier"}/>
  },
  {
    accessorKey: "invoice.total",
    header: "Amount",
    size: 120,
    cell: ({row}) => <span>{currencyMap(row.original.invoice?.currency ?? "usd")}{formatMinorAmount(row.original.invoice?.total)}</span> 
  },
  
  {
    accessorKey: "invoice.payment.status",
    header: "Payment Status",
    size: 150,
    cell: ({row}) => <Badge className="uppercase" variant={row.original.invoice?.payment?.status == "paid" ? "success" : row.original.invoice?.payment?.status == "partial" ? "secondary" : "warning"} appearance="outline">{row.original.invoice?.payment?.status ?? "Unpaid"}</Badge>
  },
  {
    accessorKey: "invoice.issuedAt",
    header: "Issued date",
    size: 160,
    cell: ({ row }) => <span>{formatDate("MMM_DD_YYYY", row.original.invoice?.issuedAt)}</span>
  },
  {
    accessorKey: "action",
    size: 80,
    header: "Action",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <ActionsCell id={row.original._id as string} />
      </div>
    ),
  },
];
