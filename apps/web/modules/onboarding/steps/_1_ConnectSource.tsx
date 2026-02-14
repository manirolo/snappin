"use client";

import {
  OnboardingContent,
  OnboardingDescription,
  OnboardingHeader,
  OnboardingTitle,
} from "../components/layout";
import { useOAuthRedirect } from "@snappin/features/auth/redirectToOAuthScreen";
import { appMetadata } from "@snappin/apps/app.metadata";
import { AppType } from "@snappin/shared/apps/app.enum";
import { Button } from "@snappin/ui/components/button";
import { DotSpinner } from "@snappin/ui/assets/svg/dotSpinner";
import { Icon } from "@iconify/react";
import React from "react";
import { Paragraph } from "@snappin/ui/components/typography";

export const ConnectSource = () => {
  const { redirectToOAuthConsentScreen, loading } = useOAuthRedirect();

  const sourceApps = Object.values(appMetadata).filter(
    (app) => app.type == AppType.SOURCE,
  );
  return (
    <div>
      <OnboardingHeader>
        <OnboardingTitle>
          Find all your recent invoices instantly
        </OnboardingTitle>
        <OnboardingDescription>
          We’ll scan your last 30 days and organize everything automatically.
        </OnboardingDescription>
      </OnboardingHeader>
      <OnboardingContent>
        <div className="flex flex-col gap-2 items-center">
          {sourceApps.map((app, i) => (
            <div key={i}>
              <Button
                variant={"outline"}
                size={"_2xl"}
                radius={"full"}
                disabled={loading == app.slug || loading != null}
                className="min-w-xs flex-1 sm:min-w-sm mx-auto md:min-w-102 font-bold text-lg font-dm-sans border-2"
                onClick={() =>
                  redirectToOAuthConsentScreen({
                    appSlug: app.slug,
                    appCategory: app.category,
                    appType: app.type,
                    redirectAfterPath: "/onboarding",
                  })
                }
              >
                <div className="flex items-center gap-2">
                  {loading == app.slug ? (
                    <DotSpinner className="size-10 text-gray-6" gap={3.5} />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Icon
                        icon={appMetadata[app.slug].icon}
                        className="size-7 mr-2"
                      />
                      Authorize read access
                    </div>
                  )}
                </div>
              </Button>
            </div>
          ))}
        </div>
      </OnboardingContent>
    </div>
  );
};
