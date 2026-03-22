"use client";

import React from "react";
import {
  Dashboard,
  DashboardContent,
  DashboardDescription,
  // DashboardDescription,
  DashboardHeader,
  DashboardHeaderMain,
  DashboardTitle,
} from "../../components/layout/dashboardLayout";
import { HugeiconsIcon } from "@hugeicons/react";
import { InboxIcon } from "@hugeicons-pro/core-bulk-rounded";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@snappin/ui/components/empty";
import { Button } from "@snappin/ui/components/button";
import { useOAuthRedirect } from "@snappin/features/auth/redirectToOAuthScreen";
import { AppMetadata, AppRole } from "@snappin/shared/apps/app.schema";
import { Spinner } from "@snappin/ui/assets/svg/spinner";
import { Image } from "@snappin/ui/components/Image";
import { appMetadata } from "@snappin/apps/app.metadata";

const AccountSourceApp = ({ appMetadata }: { appMetadata: AppMetadata }) => {
  const { redirectToOAuthConsentScreen, loading } = useOAuthRedirect();

  return (
    <Button
      variant="dim"
      className="bg-accent border-0 pl-1 gap-2 rounded-lg"
      disabled={loading === appMetadata.slug || loading != null}
      onClick={() =>
        redirectToOAuthConsentScreen({
          appSlug: appMetadata.slug,
          redirectAfterPath: "/accounts",
        })
      }
    >
      <div className="bg-gray-2 p-1 rounded-md">
        {loading === appMetadata.slug ? (
          <Spinner className="size-6" />
        ) : (
          <Image
            className="size-6 rounded-full shrink-0"
            src={appMetadata?.logoUrl ?? ""}
            alt={appMetadata.name + "'s logo"}
          />
        )}
      </div>
      Connect {appMetadata.name}
    </Button>
  );
};

export const AccountEmpty = () => {
  const sourceApps = Object.values(appMetadata).filter(
    (app) =>
      app.role.includes(AppRole.EMAIL_SOURCE) &&
      app.enableOnOnboarding === true,
  );

  return (
    <Dashboard>
      <DashboardHeader>
        <DashboardHeaderMain>
          <DashboardTitle>Email Accounts</DashboardTitle>
          <DashboardDescription>
            Connect your email to start extracting invoices automatically
          </DashboardDescription>
        </DashboardHeaderMain>
      </DashboardHeader>

      <DashboardContent>
        <Empty>
          <EmptyHeader>
            <EmptyMedia>
              <HugeiconsIcon
                icon={InboxIcon}
                className="size-14 text-primary"
              />
            </EmptyMedia>

            <EmptyTitle>No email accounts</EmptyTitle>
            <EmptyDescription>
              Connect your email to start extracting invoices automatically.
            </EmptyDescription>
          </EmptyHeader>

          <EmptyContent>
            <div className="flex items-center gap-2">
              {sourceApps.map((app) => (
                <AccountSourceApp key={app.slug} appMetadata={app} />
              ))}
            </div>
          </EmptyContent>
        </Empty>
      </DashboardContent>
    </Dashboard>
  );
};
