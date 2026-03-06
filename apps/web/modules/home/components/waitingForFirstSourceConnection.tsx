'use client'

import { appMetadata } from "@snappin/apps/app.metadata";
import { useOAuthRedirect } from "@snappin/features/auth/redirectToOAuthScreen";
import { AppType } from "@snappin/shared/apps/app.schema";
import { Small, ExtraSmall, H4 } from "@snappin/ui/components/typography";
import {
  CompactIntegrationCard,
  CompactIntegrationIcon,
  CompactIntegrationName,
} from "@snappin/features/integration/components/compactIntegrationCard";
import React from "react";
import Link from "next/link";

export const WaitingForFirstSourceConnection = () => {
  const { redirectToOAuthConsentScreen, loading } = useOAuthRedirect();

  const sourceApps = Object.values(appMetadata).filter(
    (app) => app.schema == AppType.SOURCE,
  );

  return (
    <div className="flex flex-col gap-4 mt-16">
      <div>
        <div className="space-y-2">
          <H4>⚠️ You have 0 connected sources</H4>
          <Small>Connect one to start extracting invoices automatically.</Small>
        </div>

        <div className="grid grid-cols-2 max-w-xs my-8">
          {sourceApps.map((app, i) => (
            <CompactIntegrationCard
              loading={app.slug == loading}
              key={i}
              onClick={() =>
                redirectToOAuthConsentScreen({
                  appSlug: app.slug,
                  appCategory: app.category,
                  appType: app.schema,
                })
              }
            >
              <CompactIntegrationIcon icon={appMetadata[app.slug].iconifyIcon} />
              <CompactIntegrationName>
                {appMetadata[app.slug].name}
              </CompactIntegrationName>
            </CompactIntegrationCard>
          ))}
        </div>

        <div className="my-8">
          <ExtraSmall>We only scan invoice-related emails.</ExtraSmall>
        </div>

        <div>
          <ExtraSmall>
            <Link className="underline hover:text-gray-11" href="/integrations">
              More integrations
            </Link>
          </ExtraSmall>
        </div>
      </div>
    </div>
  );
};
