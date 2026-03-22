"use client";

import { Button } from "@snappin/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@snappin/ui/components/dropdown-menu";
import React from "react";
import { useOAuthRedirect } from "@snappin/features/auth/redirectToOAuthScreen";
import { appMetadata } from "@snappin/apps/app.metadata";
import { AppRole } from "@snappin/shared/apps/app.schema";
import { Image } from "@snappin/ui/components/Image";
import { Spinner } from "@snappin/ui/assets/svg/spinner";
import { Add01Icon } from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { Badge } from "@snappin/ui/components/badge";

export const SelectProvider = () => {
  const { redirectToOAuthConsentScreen, loading } = useOAuthRedirect();

  const sourceApps = Object.values(appMetadata).filter(
    (app) => app.role.includes(AppRole.EMAIL_SOURCE) && !app.isComingSoon,
  );

  const handleProviderSelect = (e: Event, app: (typeof sourceApps)[number]) => {
    e.preventDefault();
    redirectToOAuthConsentScreen({
      appType: app.type,
      appSlug: app.slug,
      appRole: app.role,
      appCategory: app.category,
      redirectAfterPath: "/accounts",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-background" size="sm" >
          <HugeiconsIcon icon={Add01Icon} className="size-3" />
          Add Account
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-48">
        <DropdownMenuGroup>
          {sourceApps.map((app) => (
            <DropdownMenuItem
              key={app.slug}
              disabled={loading == app.slug}
              className="flex items-center gap-3 py-2 min-h-fit cursor-pointer"
              onSelect={(e) => handleProviderSelect(e, app)}
            >
              {loading == app.slug ? (
                <Spinner className="size-5 shrink-0" />
              ) : (
                <Image
                  className="size-5"
                  src={app.logoUrl ?? ""}
                  alt={app.name + "'s logo"}
                />
              )}

              <div className="flex flex-col gap-0.5">
                <span className="flex-1 text-sm text-slate-700 font-medium">
                  {app.name}
                </span>
                <span className="flex-1 text-[13px] text-slate-400">
                  {app.cta}
                </span>
              </div>
              {app.isComingSoon && (
                <Badge appearance="outline" size="xs">
                  Coming soon
                </Badge>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
