"use client";

import type { RouterOutputs } from "@snappin/features/trpc/_root";
import { ColumnDef } from "@snappin/ui/components/table";
import { appMetadata } from "@snappin/apps/app.metadata";
import { Paragraph, Small } from "@snappin/ui/components/typography";
import { Button } from "@snappin/ui/components/button";
import { Image } from "@snappin/ui/components/Image";
import {
  HiOutlineTrash,
  HiDotsHorizontal,
  HiOutlineRefresh,
} from "react-icons/hi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@snappin/ui/components/dropdown-menu";
import { trpc } from "@snappin/features/trpc/react/client";
import { useConfirmStore } from "@snappin/ui/components/alert/fn/store";
import { useState } from "react";
import toast from "react-hot-toast";
import { EmailAppSlug } from "@snappin/shared/apps/app.schema";
import { Spinner } from "@snappin/ui/assets/svg/spinner";
import { useOAuthRedirect } from "@snappin/features/auth/redirectToOAuthScreen";
import { Badge } from "@snappin/ui/components/badge";
import {
  IntegrationStatus,
  statusLabel,
} from "@snappin/shared/integration/status.enum";
import { truncateEnd } from "@snappin/lib/string/truncate";

type IntegrationRow =
  RouterOutputs["integration"]["connectedEmailAccounts"][number];

const AccountActionCell = ({
  accountId,
  appSlug,
  needReAuthorization,
}: {
  accountId: string;
  monitored?: boolean;
  appSlug?: EmailAppSlug | null;
  needReAuthorization?: boolean;
}) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const utils = trpc.useUtils();
  const openConfirm = useConfirmStore((s) => s.openConfirm);
  const { redirectToOAuthConsentScreen, loading } = useOAuthRedirect();

  if (!appSlug) return null;

  const isReAuthLoading = loading === appSlug;
  const isBusy = isDeleting || isReAuthLoading;

  const handleReAuthorization = () => {
    redirectToOAuthConsentScreen({
      appSlug: appSlug,
      redirectAfterPath: "/dashboard",
      reAuthenticate: { integrationId: accountId },
    });
  };

  // const updateMonitoring =
  //   trpc.integration.accounts.updateMonitoring.useMutation({
  //     onSuccess: (data) => {
  //       utils.integration.accounts.getAccount.invalidate({ accountId });
  //       utils.integration.connectedEmailAccounts.invalidate();
  //       toast.success(
  //         `Monitoring ${data?.status == IntegrationStatus.CONNECTED ? "enabled" : "disabled"}`,
  //       );
  //       setIsMailMonitoredUpdating(false);
  //     },
  //     onError: (err) => {
  //       toast.error(err.message ??"Failed to update monitoring");
  //       setIsMailMonitoredUpdating(false);
  //     },
  //   });

  const deleteAccount = trpc.integration.accounts.disconnectAccount.useMutation(
    {
      onSuccess: () => {
        utils.invalidate();
        toast.success("Account deleted successfully");
        setIsDeleting(false);
      },
      onError: () => {
        utils.invalidate();
        toast.error("Failed to delete account");
        setIsDeleting(false);
      },
    },
  );

  // const handleMonitorUpdate = () => {
  //   setIsMailMonitoredUpdating(true);
  //   updateMonitoring.mutate({
  //     integrationId: accountId,
  //     disable: monitored,
  //   });
  // };

  const handleDisconnect = () => {
    openConfirm({
      title: "Delete Account",
      description: "Are you sure that you want to delete this account?",
      confirmLabel: "Confirm",
      destructive: true,
      onConfirm: () => {
        setIsDeleting(true);
        deleteAccount.mutate({
          integrationId: accountId,
          appSlug: appSlug as EmailAppSlug,
        });
      },
    });
  };

  return (
    <div className="flex justify-end pr-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="ghost" disabled={isBusy} className="px-2">
            {isBusy ? <Spinner /> : <HiDotsHorizontal className="size-4" />}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent side="right" align="end" sideOffset={6}>
          {needReAuthorization && (
            <DropdownMenuItem
              disabled={isReAuthLoading}
              onSelect={handleReAuthorization}
            >
              <HiOutlineRefresh className="size-4 mr-2" />
              Re-authorize
            </DropdownMenuItem>
          )}
          {needReAuthorization && <DropdownMenuSeparator />}

          <DropdownMenuItem
            disabled={isDeleting}
            onSelect={handleDisconnect}
            className="text-destructive focus:text-destructive focus:bg-destructive/5"
          >
            <HiOutlineTrash className="size-4 mr-2" />
            Delete account
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const accountsColumn = (): ColumnDef<IntegrationRow>[] => [
  {
    id: "appSlug",
    header: "Account",
    size: 200,
    minSize: 140,
    cell: ({ row }) => (
      <div className="flex items-center gap-10 p-1">
        <div className="flex items-center gap-4">
          <Image
            className="size-6 shrink-0"
            src={
              row.original.appSlug
                ? (appMetadata[row.original.appSlug]?.logoUrl ?? "")
                : ""
            }
            alt={
              row.original.appSlug
                ? appMetadata[row.original.appSlug].name + "'s logo"
                : "logo"
            }
          />
          <div>
            <Paragraph className="font-medium">
              {row.original?.appSlug &&
                row.original.appSlug.charAt(0).toUpperCase() +
                  row.original.appSlug.slice(1)}
            </Paragraph>
            <Small
              className="text-[13px]! text-muted-foreground"
              title={row.original.identifierEmail ?? ""}
            >
              {truncateEnd(row.original.identifierEmail ?? "")}
            </Small>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "status",
    header: "",
    cell: ({ row }) => {
      const status = row.original.status as IntegrationStatus;
      const config = status ? statusLabel[status] : null;
      if (!config) return null;

      if (status === IntegrationStatus.PAUSED) {
        return (
          <Badge appearance="light" size="sm" variant="warning">
            Monitoring paused
          </Badge>
        );
      }

      if (
        status === IntegrationStatus.REAUTH_REQUIRED ||
        status !== IntegrationStatus.CONNECTED
      ) {
        return (
          <Badge appearance="light" size="sm" variant={config.variant}>
            {config.label}
          </Badge>
        );
      }
    },
  },
  {
    id: "action",
    meta: { disableHover: true },
    header: () => <div className="text-end">Actions</div>,
    cell: ({ row }) => (
      <AccountActionCell
        accountId={row.original?._id ?? ""}
        appSlug={row.original?.appSlug as EmailAppSlug | null}
        needReAuthorization={row?.original?.reAuthenticationRequired ?? false}
      />
    ),
  },
];
