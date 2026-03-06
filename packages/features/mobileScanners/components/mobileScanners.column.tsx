"use client";

import { Icon } from "@iconify/react";
import { RouterOutputs } from "@snappin/features/trpc/_root";
import { ColumnDef } from "@snappin/ui/components/table";
import { appMetadata } from "@snappin/apps/app.metadata";
import { Paragraph } from "@snappin/ui/components/typography";
import { HugeiconsIcon } from "@hugeicons/react";
import { trpc } from "@snappin/features/trpc/react/client";
import { useConfirmStore } from "@snappin/ui/components/alert/fn/store";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@snappin/ui/components/dropdown-menu";
import { MoreHorizontalIcon } from "@hugeicons-pro/core-solid-rounded";
import { cn } from "@snappin/ui/lib/utils";
import { AppSlug } from "@snappin/shared/apps/app.schema";

type IntegrationRow =
  RouterOutputs["integration"]["connectedEmailAccounts"]["data"][number];

type ActionKey = "delete";

type ActionConfig = {
  key: ActionKey;
  label: string;
  destructive?: boolean;
  children?: ActionConfig[];
};

const actionsConfig: ActionConfig[] = [
  {
    key: "delete",
    label: "Delete permanently",
    destructive: true,
  },
];

const ActionsCell = ({ id, appSlug }: { id: string, appSlug?: AppSlug | null }) => {
  const [activeAction, setActiveAction] = useState<ActionKey | null>(null);
  const utils = trpc.useUtils();
  const openConfirm = useConfirmStore((s) => s.openConfirm);

  const deleteIntegration = trpc.integration.removeIntegration.useMutation({
    onSuccess: async () => {
      toast.success("Account deleted successfully");
      setActiveAction(null);
      await utils.integration.getIntegration.invalidate();
    },
    onError: () => {
      toast.error("Failed to delete account");
      setActiveAction(null);
    },
  });

  const actionHandlers: Record<ActionKey, () => void> = {
    delete: () => {
      openConfirm({
        // icon: <HugeiconsIcon icon={Delete01Icon} className="size-6"/>,
        title: "Delete Account",
        description: "Are you sure that you want to delete this account?",
        confirmLabel: "Delete",
        destructive: true,
        size: "sm",
        onConfirm: () => {
          setActiveAction("delete");
          if(!appSlug) return
          deleteIntegration.mutate({ integrationId: id, appSlug  });
        },
      });
    },
  };

  const renderAction = (action: ActionConfig) => {
    const isLoading = activeAction === action.key;

    if (action.children?.length) {
      return (
        <DropdownMenuSub key={action.key}>
          <DropdownMenuSubTrigger className="h-9">
            {action.label}
          </DropdownMenuSubTrigger>

          <DropdownMenuSubContent
            sideOffset={10}
            alignOffset={-10}
            className="min-w-44"
          >
            {action.children.map(renderAction)}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      );
    }

    return (
      <DropdownMenuItem
        key={action.key}
        disabled={isLoading}
        className={cn(
          "h-9 flex items-center gap-2",
          action.destructive &&
            "text-destructive data-highlighted:bg-red-50 data-highlighted:text-destructive",
        )}
        onSelect={(e) => {
          e.preventDefault();
          actionHandlers[action.key]();
        }}
      >
        {isLoading && (
          <Icon icon="line-md:loading-twotone-loop" className="h-4 w-4" />
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

      <DropdownMenuContent
        side="right"
        align="start"
        sideOffset={6}
        className="min-w-44"
      >
        {actionsConfig.map(renderAction)}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const accountsColumn = (): ColumnDef<IntegrationRow>[] => [
  {
    id: "appSlug",
    header: "Email",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Icon
          icon={
            row.original.appSlug
              ? appMetadata[row?.original?.appSlug].iconifyIcon
              : ""
          }
        />
        <Paragraph className="text-slate-400!">
          {row.original.identifierEmail}
        </Paragraph>
      </div>
    ),
  },
  {
    id: "monitored",
    header: "Monitored",
    cell: ({ row }) => (
      <span>{row.original?.config?.mailMonitored ? "Yes" : "No"}</span>
    ),
  },
  {
    id: "action",
    header: "Actions",
    cell: ({ row }) => (
      <ActionsCell id={row.original?._id?.toString() ?? ""} appSlug={row.original?.appSlug ?? null} />
    ),
  },
];
