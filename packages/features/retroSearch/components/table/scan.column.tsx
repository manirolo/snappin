import { RouterOutputs } from "@snappin/features/trpc/_root";
import { ColumnDef } from "@snappin/ui/components/table";
import { Button } from "@snappin/ui/components/button";
import { Delete02Icon } from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { trpc } from "@snappin/features/trpc/react/client";
import { AppSlug } from "@snappin/shared/apps/app.schema";
import { useConfirmStore } from "@snappin/ui/components/alert/fn/store";
import { useState } from "react";
import { Spinner } from "@snappin/ui/assets/svg/spinner";
import toast from "react-hot-toast";
import { capitalize } from "@snappin/lib/string/capitalize";
import { formatDate } from "@snappin/lib/date/formateDate";
import { ScanStatus } from "@snappin/shared/inbox/scan.schema"

type ScanRow = RouterOutputs["retroSearch"]["getScans"][number];

const ActionsCell = ({
  id,
  appSlug,
}: {
  id?: string | null;
  appSlug?: AppSlug | null;
}) => {
  const openConfirm = useConfirmStore((s) => s.openConfirm);
  const [loading, setLoading] = useState<string | null>(null);

  const utils = trpc.useUtils();
  const deleteIntegration = trpc.integration.removeIntegration.useMutation({
    onSuccess() {
      toast.success("Integration deleted successfully");
      utils.integration.getIntegration.invalidate();
      setLoading(null);
    },
    onError() {
      setLoading(null);
      toast.error("Failed to delete integration");
    },
  });

  const removeIntegration = (integrationId: string, appSlug: AppSlug) => {
    openConfirm({
      // icon: <HugeiconsIcon icon={Delete01Icon} className="size-6"/>,
      title: "Delete integration",
      description: "Are you sure that you want to delete this integration?",
      confirmLabel: "Delete",
      destructive: true,
      size: "sm",
      onConfirm: () => {
        setLoading(integrationId);
        deleteIntegration.mutate({ integrationId, appSlug });
      },
    });
  };

  if (!id || !appSlug) return;

  return (
    <div>
      <Button
        variant={"destructive"}
        size={"sm"}
        onClick={() => removeIntegration(id, appSlug)}
      >
        {loading ? <Spinner /> : <HugeiconsIcon icon={Delete02Icon} />}
      </Button>
    </div>
  );
};

export const scanColumns = (): ColumnDef<ScanRow>[] => [
  {
    id: "scanId",
    header: "# Scan Id",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">{row.original.scanId}</div>
    ),
  },
  {
    id: "account",
    header: "Account",
    cell: ({ row }) => <div>{row.original?.integration?.identifierEmail}</div>,
  },
  {
    id: "range",
    header: "Date Range",
    cell: ({ row }) => (
      <div>
        {formatDate("MMM_DD_YYYY",row.original?.startDate)} - {formatDate("MMM_DD_YYYY",row.original?.endDate)}
      </div>
    ),
  },
  {
    id: "invoice_found",
    header: "Invoice Found",
    cell: () => <div>0</div>,
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => <div>{capitalize(row.original?.status ?? ScanStatus.QUEUED)}</div>,
  },
];
