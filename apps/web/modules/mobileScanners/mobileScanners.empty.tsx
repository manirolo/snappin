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
      className="p-3 py-5 bg-accent border-0 rounded-lg"
      disabled={loading === appMetadata.slug || loading != null}
      onClick={() =>
        redirectToOAuthConsentScreen({ appSlug: appMetadata.slug, redirectAfterPath: "/accounts" })
      }
    >
      {loading === appMetadata.slug ? (
        <Spinner className="size-6" />
      ) : (
        <Image
          className="size-6 rounded-full shrink-0"
          src={appMetadata?.logoUrl ?? ""}
          alt={appMetadata.name + "'s logo"}
        />
      )}
      Connect {appMetadata.name}
    </Button>
  );
};

export const MobileScannersEmpty = () => {
  const sourceApps = Object.values(appMetadata).filter(
    (app) =>
      app.role.includes(AppRole.EMAIL_SOURCE) &&
      app.enableOnOnboarding === true,
  );

  return (
    <Dashboard>
      <DashboardHeader>
        <DashboardHeaderMain>
          <DashboardTitle>Mobile Scanners</DashboardTitle>
          <DashboardDescription>
            Connect your scanners to start extracting invoices
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
