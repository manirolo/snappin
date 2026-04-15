"use client";

import { Button } from "@snappin/ui/components/button";
import React, { Dispatch, SetStateAction } from "react";
import { useOAuthRedirect } from "@snappin/features/auth/redirectToOAuthScreen";
import { appMetadata } from "@snappin/apps/app.metadata";
import { AppRole } from "@snappin/shared/apps/app.schema";
import { Image } from "@snappin/ui/components/Image";
import { Spinner } from "@snappin/ui/assets/svg/spinner";
import { Badge } from "@snappin/ui/components/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogLabel,
  DialogTitle,
  DialogDescription,
} from "@snappin/ui/components/dialog";

export const SelectProvider = ({
  redirectAfterPath,
  open,
  setOpen,
}: {
  redirectAfterPath?: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { redirectToOAuthConsentScreen, loading } = useOAuthRedirect();

  const sourceApps = Object.values(appMetadata).filter((app) =>
    app.role.includes(AppRole.EMAIL_SOURCE),
  );

  const handleProviderSelect = (app: (typeof sourceApps)[number]) => {
    redirectToOAuthConsentScreen({
      appType: app.type,
      appSlug: app.slug,
      appRoles: app.role,
      appCategory: app.category,
      redirectAfterPath: redirectAfterPath ?? "/accounts",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-360">
        <DialogHeader>
          <DialogLabel>Connect</DialogLabel>
          <DialogTitle>Email Source</DialogTitle>
          <DialogDescription>
            Start extracting invoice automatically
          </DialogDescription>
        </DialogHeader>
        <div className="px-5 py-8 pb-5 max-w-sm w-full mx-auto space-y-1">
          {sourceApps.map((app) => (
            <div
              key={app.slug}
              className="w-full flex justify-start bg-popover items-center gap-4 py-2.5 min-h-fit p-3 transition-all duration-300 shadow-none rounded-xl"
            >
              <Image
                className="size-5"
                src={app.logoUrl ?? ""}
                alt={app.name + "'s logo"}
              />

              <div className="flex flex-col gap-px">
                <div className="flex w-fit items-center gap-1 justify-start">
                  <span className="flex-1 text-sm text-fg-4 font-medium">
                    {app.name}
                  </span>

                  {app.isComingSoon && (
                    <Badge appearance="outline" size="xs">
                      Coming soon
                    </Badge>
                  )}
                </div>
                <span className="flex-1 font-normal text-[13px] text-fg-2">
                  {app.cta}
                </span>
              </div>

              <div className="ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={loading == app.slug || loading != null}
                  onClick={() => handleProviderSelect(app)}
                >
                  {loading == app.slug && (
                    <Spinner className="text-fg-4 shrink-0" />
                  )}
                  Connect
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
