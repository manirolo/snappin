"use client";

import type { RouterOutputs } from "@snappin/features/trpc/_root";
import { ColumnDef } from "@snappin/ui/components/table";
import { formatDate } from "@snappin/lib/date/formateDate";
import { Badge } from "@snappin/ui/components/badge";
import { ScanErrorReason, ScanStatus } from "@snappin/shared/inbox/scan.schema";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@snappin/ui/components/tooltip";
import { HiOutlineInformationCircle } from "react-icons/hi";

type RetroSearch = RouterOutputs["retroSearch"]["getScans"][number];

export const scanColumn = (): ColumnDef<RetroSearch>[] => [
  {
    id: "scanRange",
    header: "Scan Range",
    cell: ({ row }) => (
      <div>
        <span>{formatDate("DD_MMM_YYYY", row.original?.startDate)}</span>
        <span> - </span>
        <span>{formatDate("DD_MMM_YYYY", row.original?.endDate)}</span>
      </div>
    ),
  },
  {
    id: "account",
    header: "Account",
    cell: ({ row }) => (
      <div>
        <span>{row.original?._integration?.identifier}</span>
      </div>
    ),
  },

  {
    id: "estimation",
    header: "Estimated time",
    cell: ({ row }) => {
      const status = row.original.status;
      const estimatedDuration = row.original?.estimatedDuration;

      const display = () => {
        if (status === ScanStatus.QUEUED) return "Waiting to start...";
        if (status === ScanStatus.SUCCESS) return estimatedDuration ?? "-";
        if (status === ScanStatus.FAILED) return estimatedDuration ?? "-";
        if (status === ScanStatus.IN_PROGRESS && estimatedDuration == null)
          return "Estimating...";
        if (status === ScanStatus.IN_PROGRESS && estimatedDuration)
          return estimatedDuration;
        return "-";
      };

      return (
        <div>
          <span className="text-xs">{display()}</span>
        </div>
      );
    },
  },
  {
    id: "found",
    header: "Found",
    cell: ({ row }) => (
      <div>
        <span>{row.original?.invoiceFound?.length ?? 0}</span>
      </div>
    ),
  },
  {
    id: "status",
    header: "Status",
    meta: { disableHover: true },
    cell: ({ row }) => {
      const statusVariant: Record<
        ScanStatus,
        React.ComponentProps<typeof Badge>["variant"]
      > = {
        [ScanStatus.QUEUED]: "secondary",
        [ScanStatus.IN_PROGRESS]: "info",
        [ScanStatus.SUCCESS]: "success",
        [ScanStatus.FAILED]: "destructive",
        [ScanStatus.PAUSED]: "warning",
      };

      const status = (row.original?.status ?? "unknown") as ScanStatus;
      const errorReason = row.original?.errorReason;

      const formatStatus = (status: string) =>
        status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

      const badge = (
        <Badge appearance="outline" size="sm" variant={statusVariant[status]}>
          {formatStatus(status)}
          {/* small indicator dot if there's an error reason */}
          {errorReason && status === ScanStatus.FAILED && (
            <HiOutlineInformationCircle />
          )}
        </Badge>
      );

      if (errorReason && status === ScanStatus.FAILED) {
        return (
          <Tooltip>
            <TooltipTrigger asChild>{badge}</TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs text-xs">
              {errorReason == ScanErrorReason.INVOICE_LIMIT_REACHED &&
                "Invoice limit reached. Upgrade to extract more"}
            </TooltipContent>
          </Tooltip>
        );
      }

      return <div>{badge}</div>;
    },
  },
];
