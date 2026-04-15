'use client'

import { appMetadata } from "@snappin/apps/app.metadata";
import { useOAuthRedirect } from "@snappin/features/auth/redirectToOAuthScreen";
import { AppCategory, AppType, EmailAppSlug } from "@snappin/shared/apps/app.schema";
import { Small, ExtraSmall, H4 } from "@snappin/ui/components/typography";
import {
  CompactIntegrationCard,
  CompactIntegrationIcon,
  CompactIntegrationName,
} from "@snappin/features/integration/components/compactIntegrationCard";
import React from "react";

export const WaitingForFirstSourceConnection = () => {
  const { redirectToOAuthConsentScreen, loading } = useOAuthRedirect();

  const sourceApps = Object.values(appMetadata).filter(
    (app) => app.type == AppType.SOURCE && app.category == AppCategory.EMAIL && app.enableOnOnboarding == true,
  );

  return (
    <div className="flex flex-col items-center mx-auto gap-4 mt-14">
      <div>
        <div className="space-y-2 text-center">
          <H4>Connect your sources</H4>
          <Small>Connect one account to start extracting invoices automatically.</Small>
        </div>

        <div className="grid grid-cols-2 max-w-xs gap-4 my-8 mx-auto">
          {sourceApps.map((app, i) => (
            <CompactIntegrationCard
              loading={app.slug == loading}
              key={i}
              onClick={() =>
                redirectToOAuthConsentScreen({
                  appSlug: app.slug,
                  appCategory: app.category,
                  appType: app.type,
                  redirectAfterPath: "/dashboard"
                })
              }
            >
              <CompactIntegrationIcon icon={appMetadata[app.slug as EmailAppSlug].iconifyIcon} />
              <CompactIntegrationName>
                {appMetadata[app.slug as EmailAppSlug].name}
              </CompactIntegrationName>
            </CompactIntegrationCard>
          ))}
        </div>

        <div className="my-8 text-center">
          <ExtraSmall>We only scan invoice-related emails.</ExtraSmall>
        </div>
      </div>
    </div>
  );
};
