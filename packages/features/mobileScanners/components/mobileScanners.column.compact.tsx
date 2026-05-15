"use client";

import type { RouterOutputs } from "@snappin/features/trpc/_root";
import { ColumnDef } from "@snappin/ui/components/table";
import { appMetadata } from "@snappin/apps/app.metadata";
import { Paragraph } from "@snappin/ui/components/typography";
import { Button } from "@snappin/ui/components/button";
import { Image } from "@snappin/ui/components/Image";
import { HiOutlineTrash, HiDotsHorizontal } from "react-icons/hi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@snappin/ui/components/dropdown-menu";
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
import { Badge } from "@snappin/ui/components/badge";

type IntegrationRow = RouterOutputs["integration"]["connectedSource"][number];

const AccountActionCell = ({
  accountId,
  appSlug,
}: {
  accountId: string;
  appSlug?: EmailAppSlug | null;
  needReAuthorization?: boolean;
}) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const utils = trpc.useUtils();
  const openConfirm = useConfirmStore((s) => s.openConfirm);

  if (!appSlug) return null;

  const isBusy = isDeleting;

  const deleteAccount =
    trpc.integration.mobileScanners.removeMobileScanner.useMutation({
      onSuccess: () => {
        utils.invalidate();
        toast.success("Account deleted successfully");
        setIsDeleting(false);
      },
      onError: (error) => {
        utils.invalidate();
        toast.error(error.message ?? "Failed to delete account");
        setIsDeleting(false);
      },
    });

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

        <DropdownMenuContent side="right" align="start" sideOffset={6}>
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

export const mobileScannersColumn = (): ColumnDef<IntegrationRow>[] => [
  {
    id: "scanner",
    header: "Scanner",
    size: 200,
    minSize: 140,
    cell: ({ row }) => (
      <div className="flex items-center gap-10 p-1">
        <div className="flex items-center gap-2">
          <Image
            className="size-5 shrink-0"
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
              {row.original?.metadata?.phone}
            </Paragraph>
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
             Paused
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
