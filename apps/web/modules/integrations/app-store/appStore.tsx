import { appMetadata } from "@snappin/apps/app.metadata";
import { Integration } from "@snappin/features/integration/components/integrationCard";
import {
  GroupIntegrationCard,
  GroupIntegrationContent,
} from "@snappin/features/integration/components/groupIntegrationCard";
import { useOAuthRedirect } from "@snappin/features/auth/redirectToOAuthScreen";

export const AppStore = () => {
  const { redirectToOAuthConsentScreen, loading } = useOAuthRedirect();

  const allApps = Object.values(appMetadata);

  return (
    <div>
      <GroupIntegrationCard>
        <GroupIntegrationContent>
          <div className="grid grid-col-1 sm:grid-cols-2 md:grid-cols-3 w-fit xl:grid-cols-3 2xl:grid-cols-3 gap-4">
            {allApps.map((app, i) => (
              <Integration
                key={i}
                name={app.name}
                description={app.description}
                icon={app.iconifyIcon}
                loading={loading}
                appSlug={app.slug}
                isComingSoon={app.isComingSoon}
                note={app.disclaimer}
                onClick={() =>
                  redirectToOAuthConsentScreen({
                    appSlug: app.slug, // only slug needed now
                    redirectAfterPath: "/integrations",
                  })
                }
              />
            ))}
          </div>
        </GroupIntegrationContent>
      </GroupIntegrationCard>
    </div>
  );
};
