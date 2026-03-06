import { AppRegistry } from "@snappin/apps/appRegistry";
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

export const WatchingForFirstInvoice = () => {
  const { redirectToOAuthConsentScreen, loading } = useOAuthRedirect();

  const sourceApps = Object.values(AppRegistry).filter(
    (app) => app.schema == AppType.SOURCE,
  );

  return (
    <div className="flex flex-col gap-4 mt-16">
      
      <div>
        <H4>You have 0 connected sources</H4>
        <Small>
          No sources connected yet. Connect one to start extracting invoices
          automatically.
        </Small>

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
              <CompactIntegrationIcon icon={AppRegistry[app.slug].metadata.iconifyIcon} />
              <CompactIntegrationName>
                {AppRegistry[app.slug].metadata.name}
              </CompactIntegrationName>
            </CompactIntegrationCard>
          ))}
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
