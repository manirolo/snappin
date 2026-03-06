"use client";

import React from "react";
import { DashboardDetailPanel } from "../../../components/layout/dashboardLayout";
import { trpc } from "@snappin/features/trpc/react/client";
import { Spinner } from "@snappin/ui/assets/svg/spinner";
import { appMetadata } from "@snappin/apps/app.metadata";
import { Image } from "@snappin/ui/components/Image";
import { formatDate } from "@snappin/lib/date/formateDate";

export const AccountDetails = ({ accountId }: { accountId: string }) => {
  const { data: account, isLoading } =
    trpc.integration.accounts.getAccount.useQuery(
      { accountId },
      { enabled: !!accountId },
    );
  if (isLoading)
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <Spinner className="size-9" />
      </div>
    );

  if (!account) return;

  return (
    <DashboardDetailPanel>
      <div className="flex justify-center mt-6">
        <div className="flex flex-col items-center justify-center text-center gap-y-5">
          <div>
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
          </div>

          <div className="space-y-1">
            <p className="text-xl font-onest tracking-tight font-semibold">
              {account.appSlug && appMetadata[account?.appSlug].name}
            </p>
            <p className="text-sm font-onest text-muted-foreground">
              Connected on{" "}
              {account.createdAt
                ? formatDate("MMM_DD_YYYY", account.createdAt)
                : "—"}
            </p>
          </div>
        </div>
      </div>
    </DashboardDetailPanel>
  );
};
