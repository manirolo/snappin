"use client";

import { RouterOutputs } from "@snappin/features/trpc/_root";
import { ColumnDef } from "@snappin/ui/components/table";
import { formatDate } from "@snappin/lib/date/formateDate";
import { Badge } from "@snappin/ui/components/badge";
import { ScanStatus } from "@snappin/shared/inbox/scan.schema";

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
      const formatStatus = (status: string) =>
        status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      return (
        <div>
          <Badge appearance="outline" size="sm" variant={statusVariant[status]}>
            {formatStatus(status)}
          </Badge>
        </div>
      );
    },
  },
];
