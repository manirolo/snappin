"use client";

import { RouterOutputs } from "@snappin/features/trpc/_root";
import { ColumnDef } from "@snappin/ui/components/table";
import { appMetadata } from "@snappin/apps/app.metadata";
import { Paragraph, Small } from "@snappin/ui/components/typography";
import { Button } from "@snappin/ui/components/button";
import { Badge } from "@snappin/ui/components/badge";
import { timeAgo } from "@snappin/lib/date/timeAgo";
import { Image } from "@snappin/ui/components/Image";
import {
  HiOutlinePause,
  HiStop,
  HiOutlineTrash,
  HiExclamationCircle,
} from "react-icons/hi";
import { trpc } from "@snappin/features/trpc/react/client";
import { useConfirmStore } from "@snappin/ui/components/alert/fn/store";
import { useState } from "react";
import toast from "react-hot-toast";
import { EmailAppSlug } from "@snappin/shared/apps/app.schema";
import { Spinner } from "@snappin/ui/assets/svg/spinner";
import {
  IntegrationStatus,
  statusLabel,
} from "@snappin/shared/integration/status.enum";
import { useOAuthRedirect } from "@snappin/features/auth/redirectToOAuthScreen";

type IntegrationRow =
  RouterOutputs["integration"]["connectedEmailAccounts"][number];

const AccountActionCell = ({
  accountId,
  monitored,
  appSlug,
  needReAuthorization,
}: {
  accountId: string;
  monitored?: boolean;
  appSlug?: EmailAppSlug | null;
  needReAuthorization?: boolean;
}) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isMailMonitoredUpdating, setIsMailMonitoredUpdating] =
    useState<boolean>(false);
  const utils = trpc.useUtils();
  const openConfirm = useConfirmStore((s) => s.openConfirm);
  const { redirectToOAuthConsentScreen, loading } = useOAuthRedirect();

  if (!appSlug) return;

  const isReAuthLoading = loading === appSlug;

  const handleReAuthorization = () => {
    redirectToOAuthConsentScreen({
      appSlug: appSlug,
      redirectAfterPath: "/accounts",
      reAuthenticate: { integrationId: accountId },
    });
  };

  const updateMonitoring =
    trpc.integration.accounts.updateMonitoring.useMutation({
      onSuccess: (data) => {
        utils.integration.accounts.getAccount.invalidate({ accountId });
        utils.integration.connectedEmailAccounts.invalidate();
        toast.success(
          `Monitoring ${(data?.config as { mailMonitored?: boolean })?.mailMonitored ? "enabled" : "disabled"}`,
        );
        setIsMailMonitoredUpdating(false);
      },
      onError: () => {
        toast.error("Failed to update monitoring");
        setIsMailMonitoredUpdating(false);
      },
    });

  const deleteAccount = trpc.integration.removeIntegration.useMutation({
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
  });

  const handleMonitorUpdate = () => {
    setIsMailMonitoredUpdating(true);
    updateMonitoring.mutate({
      integrationId: accountId,
      mailMonitored: !monitored,
    });
  };

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
    <div className="ml-auto w-full flex gap-2 justify-end">
      {needReAuthorization && (
        <Button
          disabled={isReAuthLoading}
          size="sm"
          variant="dim"
          onClick={handleReAuthorization}
        >
          {isReAuthLoading ? <Spinner /> : null}
          Re-Authorize
        </Button>
      )}
      {!needReAuthorization && (
        <Button
          disabled={isMailMonitoredUpdating}
          size="sm"
          variant="dim"
          onClick={handleMonitorUpdate}
        >
          {isMailMonitoredUpdating ? (
            <Spinner />
          ) : monitored ? (
            <HiStop />
          ) : (
            <HiOutlinePause />
          )}{" "}
          {monitored ? "Stop" : "Resume"}
        </Button>
      )}
      <Button
        size="sm"
        variant="destructive"
        disabled={isDeleting}
        onClick={handleDisconnect}
      >
        {isDeleting ? <Spinner /> : <HiOutlineTrash />}
      </Button>
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
          {/* Fix 2: cast appSlug to keyof typeof appMetadata */}
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
            <Paragraph className="font-semibold text-gray-500">
              {row.original?.appSlug &&
                row.original.appSlug.charAt(0).toUpperCase() +
                  row.original.appSlug.slice(1)}
            </Paragraph>
            <Small className="text-[13px]! text-gray-500">
              {row.original.identifierEmail}
            </Small>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status as IntegrationStatus;
      const config = status ? statusLabel[status] : null;
      if (!config) return null;

      return (
        <Badge appearance="outline" size="sm" variant={config.variant}>
          {config.label}
        </Badge>
      );
    },
  },

  {
    id: "monitored",
    header: "Monitored",
    cell: ({ row }) => (
      <div>
        {"mailMonitored" in (row.original?.config ?? {}) &&
        (row.original?.config as { mailMonitored?: boolean })?.mailMonitored ? (
          "Yes"
        ) : (
          <span className="flex items-center gap-0.5 text-destructive">
            <HiExclamationCircle /> No
          </span>
        )}
      </div>
    ),
  },
  {
    id: "user",
    header: "User",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Image
          className="size-5 rounded-md"
          src={row.original?.user?.profileUrl ?? ""}
          alt={row.original?.user?.fullName + "'s profile photo"}
        />{" "}
        {row.original?.user?.fullName}
      </div>
    ),
  },
  {
    id: "lastActivity",
    header: () => <div className="text-start">Last Activity</div>,
    cell: ({ row }) => (
      <Small className="text-gray-500 text-start">
        {timeAgo(row.original?.lastActivityAt ?? "")}
      </Small>
    ),
  },

  {
    id: "action",
    header: () => <div className="text-end">Action</div>,
    cell: ({ row }) => (
      <AccountActionCell
        accountId={row.original?._id ?? ""}
        monitored={
          (row.original?.config as { mailMonitored?: boolean })
            ?.mailMonitored ?? false
        }
        appSlug={row.original?.appSlug as EmailAppSlug | null}
        needReAuthorization={row?.original?.reAuthenticationRequired ?? false}
      />
    ),
  },
];
