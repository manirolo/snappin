"use client";

import { appMetadata } from "@snappin/apps/app.metadata";
import { AppType } from "@snappin/shared/apps/app.enum";
import { Integration } from "@snappin/features/integration/components/integrationCard";
import { useOAuthRedirect } from "@snappin/features/auth/redirectToOAuthScreen";
import React from "react";

export const AppStore = () => {
  const { redirectToOAuthConsentScreen, loading } = useOAuthRedirect();

  const sourceApps = Object.values(appMetadata).filter(
    (app) => app.type == AppType.SOURCE,
  );
  
  return (
        <div className="grid grid-col-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sourceApps.map((app, i) => (
            <Integration
              key={i}
              name={app.name}
              description={app.description}
              icon={app.icon}
              loading={loading}
              appSlug={app.slug}
              note={app.note}
              onClick={() =>
                redirectToOAuthConsentScreen({
                  appType: app.type,
                  appSlug: app.slug,
                  appCategory: app.category,
                  redirectAfterPath: "/integrations",
                })
              }
            />
          ))}
        </div>
  );
};
