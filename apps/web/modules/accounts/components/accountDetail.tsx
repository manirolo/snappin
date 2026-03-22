"use client";

import React, { useState } from "react";
import { DashboardDetailPanel } from "../../../components/layout/dashboardLayout";
import { trpc } from "@snappin/features/trpc/react/client";
import { Spinner } from "@snappin/ui/assets/svg/spinner";
import { appMetadata } from "@snappin/apps/app.metadata";
import { Image } from "@snappin/ui/components/Image";
import { formatDate } from "@snappin/lib/date/formateDate";
import { timeAgo } from "@snappin/lib/date/timeAgo";
import toast from "react-hot-toast";
import { EmailAppSlug } from "@snappin/shared/apps/app.schema";
import {
  DetailCard,
  DetailCardHeader,
  DetailCardLogo,
  DetailCardDescription,
  DetailCardFooter,
  DetailCardActionGroup,
  DetailCardAction,
  DetailCardSection,
  DetailRow,
} from "@snappin/ui/components/detailCard";
import {
  HiCheckCircle,
  HiExclamationCircle,
  HiOutlineBan,
  HiOutlinePause,
  HiStop,
} from "react-icons/hi";
import { useConfirmStore } from "@snappin/ui/components/alert/fn/store";

export const AccountDetails = ({ accountId }: { accountId: string }) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isMailMonitoredUpdating, setIsMailMonitoredUpdating] =
    useState<boolean>(false);
  const utils = trpc.useUtils();
  const openConfirm = useConfirmStore((s) => s.openConfirm);
  const { data: account, isLoading } =
    trpc.integration.accounts.getAccount.useQuery(
      { accountId },
      { enabled: !!accountId },
    );

  const updateMonitoring =
    trpc.integration.accounts.updateMonitoring.useMutation({
      onSuccess: (data) => {
        utils.integration.accounts.getAccount.invalidate({ accountId });
        utils.integration.connectedEmailAccounts.invalidate();
        toast.success(
          `Monitoring ${data?.config?.mailMonitored ? "enabled" : "disabled"}`,
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
      toast.error("Failed to delete account");
      setIsDeleting(false);
    },
  });

  // ✅ Early returns AFTER all hooks
  if (isLoading)
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <Spinner className="size-9" />
      </div>
    );

  if (!account) return null;

  return (
    <DashboardDetailPanel>
      <DetailCard>
        <DetailCardHeader>
          <DetailCardLogo>
            <Image
              className="size-10"
              src={
                account.appSlug
                  ? (appMetadata[account.appSlug]?.logoUrl ?? "")
                  : ""
              }
              alt={
                account.appSlug
                  ? appMetadata[account.appSlug].name + "'s logo"
                  : "logo"
              }
            />
          </DetailCardLogo>
          <p className="text-xl font-onest tracking-tight font-semibold">
            {account.appSlug && appMetadata[account.appSlug].name}
          </p>
          <DetailCardDescription>
            Connected on{" "}
            {account.createdAt
              ? formatDate("MMM_DD_YYYY", account.createdAt)
              : "—"}
          </DetailCardDescription>
        </DetailCardHeader>
        <DetailCardSection>
          <DetailRow
            label="Account"
            value={
              <div className="flex items-center gap-2">
                {account.identifierEmail}
              </div>
            }
          />
          <DetailRow
            label="User"
            value={
              <div className="flex items-center gap-2">
                <Image
                  className="size-5 rounded-md"
                  src={account?.user?.profileUrl ?? ""}
                  alt={account?.user?.fullName + "'s profile photo"}
                />{" "}
                {account?.user?.fullName}
              </div>
            }
          />
          <DetailRow
            label="Monitored"
            value={
              <div className="flex items-center gap-2">
                {account.config?.mailMonitored ? (
                  <div className="flex text-primary items-center gap-1">
                    <HiCheckCircle /> Yes
                  </div>
                ) : (
                  <div className="flex text-red-500 items-center gap-1">
                    <HiExclamationCircle /> No
                  </div>
                )}
              </div>
            }
          />
          <DetailRow
            label="Last Activity"
            value={
              <div className="flex items-center gap-2">
                {timeAgo(account.updatedAt ?? "")}
              </div>
            }
          />
        </DetailCardSection>
        <DetailCardFooter>
          <DetailCardActionGroup>
            <DetailCardAction
              icon={
                account.config?.mailMonitored ? <HiStop /> : <HiOutlinePause />
              }
              loading={isMailMonitoredUpdating}
              disabled={isMailMonitoredUpdating}
              label={
                account.config?.mailMonitored
                  ? "Stop monitoring"
                  : "Resume monitoring"
              }
              onClick={() => {
                setIsMailMonitoredUpdating(true);
                updateMonitoring.mutate({
                  integrationId: accountId,
                  mailMonitored: !account?.config?.mailMonitored,
                });
              }}
              chevron={false}
            />
            <DetailCardAction
              icon={<HiOutlineBan />}
              loading={isDeleting}
              disabled={isDeleting}
              variant="destructive"
              label="Disconnect"
              onClick={() => {
                openConfirm({
                  title: "Delete Account",
                  description:
                    "Are you sure that you want to delete this account?",
                  confirmLabel: "Confirm",
                  destructive: true,
                  onConfirm: () => {
                    setIsDeleting(true);
                    deleteAccount.mutate({
                      integrationId: accountId,
                      appSlug: account.appSlug as EmailAppSlug,
                    });
                  },
                });
              }}
            ></DetailCardAction>
            {/* <DetailCardAction
              variant="destructive"
              disabled={isDeleting}
              onClick={() => {
                setIsDeleting(true);
                deleteAccount.mutate({
                  integrationId: accountId,
                  appSlug: account.appSlug as EmailAppSlug,
                });
              }}
            >
              {isDeleting && <Spinner />}
              Delete
            </DetailCardAction> */}
          </DetailCardActionGroup>
        </DetailCardFooter>
      </DetailCard>
    </DashboardDetailPanel>
  );
};
