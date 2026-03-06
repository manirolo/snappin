"use client";

import React from "react";
import {
  NewConnection,
  NewConnectionHeader,
  NewConnectionContent,
  NewConnectionDescription,
  NewConnectionTitle,
  // NewConnectionFooter,
  NewConnectionCancel,
} from "../../components/layout/newConnection.Layout";
import { DotSpinner } from "@snappin/ui/assets/svg/dotSpinner";
import { useOAuthRedirect } from "@snappin/features/auth/redirectToOAuthScreen";
import { appMetadata } from "@snappin/apps/app.metadata";
import { AppRole } from "@snappin/shared/apps/app.schema";
import { Button } from "@snappin/ui/components/button";
import { Icon } from "@iconify/react";
import { Badge } from "@snappin/ui/components/badge";
import { cn } from "@snappin/ui/lib/utils";
import Link from "next/link";

export const NewAccountView = () => {
  const { redirectToOAuthConsentScreen, loading } = useOAuthRedirect();

  const sourceApps = Object.values(appMetadata).filter(
    (app) => app.role.includes(AppRole.EMAIL_SOURCE),
  );
  return (
    <NewConnection>
      <NewConnectionHeader>
        <NewConnectionTitle>New Email Source</NewConnectionTitle>
        <NewConnectionDescription>
          Please any of the below providers
        </NewConnectionDescription>
      </NewConnectionHeader>
      <NewConnectionContent>
        <div className="w-full flex flex-col gap-2">
          {sourceApps.map((app, i) => (
            <Button
              key={i}
              size="_2xl"
              radius="full"
              variant="outline"
              className={cn("group relative font-onest font-semibold tracking-tight w-full")}
              onClick={() => {
                redirectToOAuthConsentScreen({
                  appType: app.schema,
                  appSlug: app.slug,
                  appRole: app.role,
                  appCategory: app.category,
                  redirectAfterPath: "/accounts",
                });
              }}
            >
              {/* Centered logo + text */}
              <div>
                {loading == app.slug ? (
                  <DotSpinner className="size-8 text-gray-6" />
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Icon icon={app.iconifyIcon} />
                    Sign in with {app.name}
                  </div>
                )}
              </div>

              {/* Arrow pinned to the right edge */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 ">
                {app?.isComingSoon ? (
                  <Badge appearance="outline">Coming Soon</Badge>
                ) : (
                  <Icon
                    icon="iconamoon:arrow-right-2-duotone"
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                  />
                )}
              </div>
            </Button>
          ))}
        </div>
        <NewConnectionCancel>
          <Button variant={"link"} asChild>
            <Link href="/accounts">Cancel</Link>
          </Button>
        </NewConnectionCancel>
      </NewConnectionContent>
    </NewConnection>
  );
};
