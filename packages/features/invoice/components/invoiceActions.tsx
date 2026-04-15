"use client";

import { trpc } from "@snappin/features/trpc/react/client";
import { Spinner } from "@snappin/ui/assets/svg/spinner";
import { useConfirmStore } from "@snappin/ui/components/alert/fn/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@snappin/ui/components/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogLabel,
} from "@snappin/ui/components/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@snappin/ui/components/select";
import { Button } from "@snappin/ui/components/button";
import React, { ComponentProps, ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { cn } from "@snappin/ui/lib/utils";
import { useExport } from "@snappin/features/export/hooks/useExport";
import { appMetadata } from "@snappin/apps/app.metadata";
import { AppCategory, AppSlug } from "@snappin/shared/apps/app.schema";
import { InvoiceResource } from "@snappin/shared/invoice/invoice.schema";
import { HiTrash } from "react-icons/hi";
import { Image } from "@snappin/ui/components/Image";
import { Small } from "@snappin/ui/components/typography";
import { InvoiceExportHistory } from "./invoiceExportHistory";
import { triggerDownload } from "@snappin/features/export/utils/triggerDownload";
import { LineAmountType } from "@snappin/apps/appRegistry.interface";

// ── Types ─────────────────────────────────────────────────────────────────────

export type InvoiceActionsProps = {
  invoiceId: string;
  invoice?: InvoiceResource;
  children?: ReactNode;
  side?: ComponentProps<typeof DropdownMenuContent>["side"];
  sideOffset?: ComponentProps<typeof DropdownMenuContent>["sideOffset"];
  align?: ComponentProps<typeof DropdownMenuContent>["align"];
  redirectAfterDelete?: string;
};

type ExportIntegration = {
  _id: unknown;
  appSlug?: string | null;
  identifierEmail?: string | null;
  appCategory?: string | null;
  config?: { orgName?: string | null };
};

type ExportEntry = {
  integrationId?: string | null;
  appSlug?: string | null;
  url?: string | null;
  fileUrl?: string | null;
  externalId?: string | null;
  exportedAt?: number | null;
};

// ── Xero Export Dialog ────────────────────────────────────────────────────────

type XeroExportDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId: string;
  integrationId: string;
};

function XeroExportDialog({
  open,
  onOpenChange,
  invoiceId,
  integrationId,
}: XeroExportDialogProps) {
  const utils = trpc.useUtils();
  const [accountCode, setAccountCode] = useState<string>("");
  const [lineAmountType, setLineAmountType] = useState<LineAmountType>(
    LineAmountType.EXCLUSIVE,
  );

  // ✅ Fetch accounts from Xero when dialog opens
  const { data: accountsData, isLoading: isLoadingAccounts } =
    trpc.export.getAccounts.useQuery(
      { integrationId },
      { enabled: open }, // only fetch when dialog is open
    );

  const createBillMutation = trpc.export.createBill.useMutation({
    onSuccess: async () => {
      toast.success("Bill created in Xero successfully");
      onOpenChange(false);
      await utils.invoices.getInvoices.invalidate();
    },
    onError: (e) => {
      toast.error(e.message ?? "Failed to create bill in Xero");
    },
  });

  const handleSubmit = () => {
    if (!accountCode) {
      toast.error("Please select an account");
      return;
    }
    createBillMutation.mutate({
      invoiceId,
      integrationId,
      accountCode,
      lineAmountType,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-full">
        <DialogHeader>
          <DialogLabel>Export</DialogLabel>
          <DialogTitle>Export to Xero</DialogTitle>
          <DialogDescription>
            Send your invoice to xero accounting tool
          </DialogDescription>
        </DialogHeader>
        {isLoadingAccounts && (
          <div className="w-full flex flex-col gap-3 justify-center items-center py-12">
            <Spinner />
            <Small>Loading xero data...</Small>
          </div>
        )}
        {!isLoadingAccounts && (
          <>
            <div className="flex flex-col gap-4 py-5 px-6">
              {/* Account selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Account</label>
                <Select
                  value={accountCode}
                  onValueChange={setAccountCode}
                  disabled={isLoadingAccounts}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={"Select account"} />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {accountsData?.accounts.map((acc) => (
                      <SelectItem key={acc.code} value={acc.code ?? ""}>
                        {acc.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Line amount type selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Tax treatment</label>
                <Select
                  value={lineAmountType}
                  onValueChange={(val) =>
                    setLineAmountType(val as LineAmountType)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value={LineAmountType.EXCLUSIVE}>
                      Tax exclusive — prices don&apos;t include tax
                    </SelectItem>
                    <SelectItem value={LineAmountType.INCLUSIVE}>
                      Tax inclusive — prices include tax
                    </SelectItem>
                    <SelectItem value={LineAmountType.NONE}>No tax</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="flex flex-col-reverse justify-between gap-4 sm:flex-row px-6 pb-6">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  size="lg"
                  disabled={createBillMutation.isPending}
                  className="w-full"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={createBillMutation.isPending || !accountCode}
                className="w-full"
              >
                {createBillMutation.isPending && (
                  <Spinner className="text-white" />
                )}
                Create bill
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function useExportToStorage(invoiceId: string) {
  const utils = trpc.useUtils();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const mutation = trpc.export.exportToStorage.useMutation({
    onSuccess: async () => {
      toast.success("Invoice exported successfully");
      setLoadingId(null);
      await utils.invoices.getInvoices.invalidate();
    },
    onError: (e) => {
      toast.error(e.message ?? "Failed to export invoice");
      setLoadingId(null);
    },
  });

  const exportTo = (integrationId: string) => {
    setLoadingId(integrationId);
    mutation.mutate({ invoiceId, integrationId });
  };

  return { exportTo, loadingId };
}

type StorageIntegrationRowProps = {
  integration: ExportIntegration;
  invoiceId: string;
  exportTo: (integrationId: string) => void;
  isLoading: boolean;
};

function StorageIntegrationRow({
  integration,
  exportTo,
  isLoading,
}: StorageIntegrationRowProps) {
  const app = appMetadata[integration.appSlug as AppSlug];
  const integrationId = String(integration._id);

  return (
    <DropdownMenuItem
      disabled={isLoading}
      onSelect={(e) => {
        e.preventDefault();
        exportTo(integrationId);
      }}
      className="h-fit"
    >
      <div className="flex items-center gap-2 w-full">
        {isLoading ? (
          <Spinner />
        ) : (
          <Image
            className="size-5 shrink-0 object-contain"
            src={app?.logoUrl ?? ""}
            alt={(app?.name ?? integration.appSlug ?? "") + "'s logo"}
          />
        )}
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-sm font-medium">
            {app?.name ?? integration.appSlug}
          </span>
          {integration.identifierEmail && (
            <span className="text-xs text-muted-foreground truncate">
              {integration.identifierEmail}
            </span>
          )}
        </div>
      </div>
    </DropdownMenuItem>
  );
}

// ── Accounting integration row ────────────────────────────────────────────────

type AccountingIntegrationRowProps = {
  integration: ExportIntegration;
  invoiceId: string;
};

function AccountingIntegrationRow({
  integration,
  invoiceId,
}: AccountingIntegrationRowProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const app = appMetadata[integration.appSlug as AppSlug];
  const integrationId = String(integration._id);

  return (
    <>
      <DropdownMenuItem
        onSelect={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setDialogOpen(true); // ✅ open dialog instead of direct export
        }}
        className="h-fit"
      >
        <div className="flex items-center gap-2 w-full">
          <Image
            className="size-5 shrink-0 object-contain"
            src={app?.logoUrl ?? ""}
            alt={(app?.name ?? integration.appSlug ?? "") + "'s logo"}
          />
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-sm font-medium">
              {app?.name ?? integration.appSlug}
            </span>
            {integration.config?.orgName && (
              <span className="text-xs text-muted-foreground truncate">
                {integration.config.orgName}
              </span>
            )}
          </div>
        </div>
      </DropdownMenuItem>

      {/* ✅ Xero dialog — triggered per integration row */}
      <XeroExportDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        invoiceId={invoiceId}
        integrationId={integrationId}
      />
    </>
  );
}

// ── Export submenu ────────────────────────────────────────────────────────────

type ExportSubMenuProps = {
  invoice?: InvoiceResource;
  invoiceId: string;
  exportIntegrations: ExportIntegration[] | undefined;
  isLoadingExports: boolean;
};

function ExportSubMenu({
  invoiceId,
  exportIntegrations,
  isLoadingExports,
}: ExportSubMenuProps) {
  const { exportTo, loadingId } = useExportToStorage(invoiceId);

  if (isLoadingExports) {
    return (
      <DropdownMenuItem disabled>
        <Spinner /> Just a moment...
      </DropdownMenuItem>
    );
  }

  const storageIntegrations = exportIntegrations?.filter(
    (i) => i.appCategory === AppCategory.STORAGE,
  );
  const accountingIntegrations = exportIntegrations?.filter(
    (i) => i.appCategory === AppCategory.ACCOUNTING,
  );

  const hasStorage = !!storageIntegrations?.length;
  const hasAccounting = !!accountingIntegrations?.length;

  if (!hasStorage && !hasAccounting) {
    return (
      <DropdownMenuItem disabled className="text-muted-foreground text-xs">
        No export integrations connected
      </DropdownMenuItem>
    );
  }

  return (
    <DropdownMenuGroup className="gap-2 space-y-2">
      {/* ✅ Storage section */}
      {hasStorage && (
        <>
          {storageIntegrations!.map((integration) => (
            <StorageIntegrationRow
              key={String(integration._id)}
              integration={integration}
              invoiceId={invoiceId}
              exportTo={exportTo}
              isLoading={loadingId === String(integration._id)}
            />
          ))}
        </>
      )}

      {hasAccounting && (
        <>
          {accountingIntegrations!.map((integration) => (
            <AccountingIntegrationRow
              key={String(integration._id)}
              integration={integration}
              invoiceId={invoiceId}
            />
          ))}
        </>
      )}
    </DropdownMenuGroup>
  );
}

// ── Delete menu item ──────────────────────────────────────────────────────────

type DeleteMenuItemProps = {
  invoiceId: string;
  redirectAfterDelete?: string;
};

function DeleteMenuItem({
  invoiceId,
  redirectAfterDelete,
}: DeleteMenuItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const utils = trpc.useUtils();
  const openConfirm = useConfirmStore((s) => s.openConfirm);
  const router = useRouter();

  const deleteInvoice = trpc.invoices.deleteInvoice.useMutation({
    onSuccess: async () => {
      toast.success("Invoice deleted");
      setIsDeleting(false);
      await utils.invoices.getInvoices.invalidate();
      if (redirectAfterDelete) router.push(redirectAfterDelete);
    },
    onError: () => {
      toast.error("Failed to delete invoice");
      setIsDeleting(false);
    },
  });

  const handleDelete = () => {
    openConfirm({
      title: "Delete invoice",
      description:
        "This action cannot be undone. The invoice will be permanently deleted.",
      confirmLabel: "Delete",
      destructive: true,
      size: "sm",
      onConfirm: () => {
        setIsDeleting(true);
        deleteInvoice.mutate({ invoiceId });
      },
    });
  };

  return (
    <DropdownMenuItem
      disabled={isDeleting}
      className={cn(
        "h-9 font-semibold gap-2",
        "text-destructive data-highlighted:bg-destructive/10 data-highlighted:text-destructive",
      )}
      onSelect={(e) => {
        e.preventDefault();
        handleDelete();
      }}
    >
      {isDeleting ? <Spinner className="text-destructive" /> : <HiTrash />}
      Delete permanently
    </DropdownMenuItem>
  );
}

// ── InvoiceActions ────────────────────────────────────────────────────────────

export const InvoiceActions = (props: InvoiceActionsProps) => {
  const { exportIntegrations, isLoading: isLoadingExports } = useExport();

  const downloadPdfMutation = trpc.export.downloadPdf.useMutation({
    onSuccess: (data) =>
      triggerDownload(data.data, data.fileName, data.mimeType),
    onError: () => toast.error("Failed to download invoice"),
  });

  const exportHistory = props.invoice?.integrations as
    | ExportEntry[]
    | undefined;

  return (
    <div
      className="flex gap-2 items-center"
      onClick={(e) => e.stopPropagation()}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{props.children}</DropdownMenuTrigger>
        <DropdownMenuContent
          side={props.side ?? "left"}
          align={props.align ?? "start"}
          sideOffset={props.sideOffset ?? 6}
          className="min-w-56"
        >
          {/* ✅ Export submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="h-9 font-semibold gap-2">
              Export
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent
              sideOffset={14}
              alignOffset={-10}
              className="min-w-52"
            >
              <ExportSubMenu
                invoice={props.invoice}
                invoiceId={props.invoiceId}
                exportIntegrations={exportIntegrations as ExportIntegration[]}
                isLoadingExports={isLoadingExports}
              />
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Download */}
          <DropdownMenuItem
            disabled={downloadPdfMutation.isPending}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              downloadPdfMutation.mutate({ invoiceId: props.invoiceId });
            }}
          >
            {downloadPdfMutation.isPending && <Spinner />}
            Download
          </DropdownMenuItem>
          {exportHistory && exportHistory.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <InvoiceExportHistory integrations={exportHistory} />
            </>
          )}

          <DropdownMenuSeparator />

          <DeleteMenuItem
            invoiceId={props.invoiceId}
            redirectAfterDelete={props.redirectAfterDelete}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
