import { trpc } from "@snappin/features/trpc/react/client";
import { Spinner } from "@snappin/ui/assets/svg/spinner";
import { useConfirmStore } from "@snappin/ui/components/alert/fn/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@snappin/ui/components/dropdown-menu";
import React, { ComponentProps, ReactNode, useState } from "react";
import { useRouter } from "next/navigation"
import toast from "react-hot-toast";
import { IconSvgElement } from "@hugeicons/react";
import { Delete01Icon, SentIcon, Share01Icon } from "@hugeicons-pro/core-stroke-rounded";
import { cn } from "@snappin/ui/lib/utils";

export type InvoiceActions = {
  invoiceId: string;
  children?: ReactNode;
  side?: ComponentProps<typeof DropdownMenuContent>["side"];
  sideOffset?: ComponentProps<typeof DropdownMenuContent>["sideOffset"];
  align?: ComponentProps<typeof DropdownMenuContent>["align"];
  redirectAfterDelete?: string;
};

type ActionKey = "export" | "delete" | "xero" | "zoho" | "share";

type ActionConfig = {
  key: ActionKey;
  label: string;
  icon?: IconSvgElement;
  destructive?: boolean;
  separator?: boolean;
  children?: Omit<ActionConfig, "icon">[];
};

const actionsConfig: ActionConfig[] = [
  {
    key: "export",
    label: "Export",
    icon: SentIcon,
    children: [
      { key: "xero", label: "Add to Xero" },
      { key: "zoho", label: "Add to Zoho" },
    ],
  },
  {
    key: "share",
    label: "Share",
    icon: Share01Icon,
  },
  {
    key: "delete",
    label: "Delete permanently",
    icon: Delete01Icon,
    destructive: true,
    separator: true,
  },
];

export const InvoiceActions = (props: InvoiceActions) => {
  const [activeAction, setActiveAction] = useState<ActionKey | null>(null);
  const utils = trpc.useUtils();
  const openConfirm = useConfirmStore((s) => s.openConfirm);
  const router = useRouter();

  const deleteInvoice = trpc.invoices.deleteInvoice.useMutation({
    onSuccess: async () => {
      toast.success("Invoice deleted");
      setActiveAction(null);
      await utils.invoices.getInvoices.invalidate();
      if(props.redirectAfterDelete){
        router.push(props.redirectAfterDelete)
      }
    },
    onError: () => {
      toast.error("Failed to delete invoice");
      setActiveAction(null);
    },
  });

  const actionHandlers: Record<ActionKey, () => void> = {
    export: () => {},
    xero: () => setActiveAction("xero"),
    zoho: () => setActiveAction("zoho"),
    share: () => {},
    delete: () => {
      openConfirm({
        title: "Delete invoice",
        description:
          "This action cannot be undone. The invoice will be permanently deleted.",
        confirmLabel: "Delete",
        destructive: true,
        size: "sm",
        onConfirm: () => {
          setActiveAction("delete");
          deleteInvoice.mutate({ invoiceId: props.invoiceId });
        },
      });
    },
  };

  const renderAction = (action: ActionConfig) => {
    const isLoading = activeAction === action.key;

    if (action.children?.length) {
      return (
        <DropdownMenuSub key={action.key}>
          <DropdownMenuSubTrigger className="h-9 font-semibold gap-2">
            {action.label}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent
            sideOffset={20}
            className="min-w-48"
          >
            {action.children.map(renderAction)}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      );
    }

    return (
      <React.Fragment key={action.key}>
        {action.separator && <DropdownMenuSeparator />}
        <DropdownMenuItem
          disabled={isLoading}
          className={cn(
            "flex items-center font-semibold gap-2",
            action.destructive &&
              "text-destructive data-highlighted:bg-destructive/10 data-highlighted:text-destructive",
          )}
          onSelect={(e) => {
            e.preventDefault();
            actionHandlers[action.key]();
          }}
        >
          {isLoading ? <Spinner /> : null}
          {action.label}
        </DropdownMenuItem>
      </React.Fragment>
    );
  };

  return (
    <div className="flex gap-2 items-center" onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {props.children}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side={props.side ?? "right"}
          align={props.align ?? "start"}
          sideOffset={props.sideOffset ?? 6}
          className="min-w-56 bg-background"
        >
          {actionsConfig.map(renderAction)}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};