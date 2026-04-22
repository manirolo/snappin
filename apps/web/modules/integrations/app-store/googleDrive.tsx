import { appMetadata } from "@snappin/apps/app.metadata";
import {
  // Integration,
  IntegrationCard,
  IntegrationCardContent,
  IntegrationCardFooter,
  IntegrationCardHeader,
  IntegrationCardHeaderMain,
  IntegrationCardIcon,
  IntegrationCardTitle,
} from "@snappin/features/integration/components/integrationCard";
import { useOAuthRedirect } from "@snappin/features/auth/redirectToOAuthScreen";
import { useIntegration } from "@snappin/features/integration/hooks/useIntegration";
import { useRouter } from "next/navigation";
import { AppSlug } from "@snappin/shared/apps/app.schema";
import React, { useState } from "react";
import { trpc } from "@snappin/features/trpc/react/client";
import toast from "react-hot-toast";
import { useConfirmStore } from "@snappin/ui/components/alert/fn/store";
import { Badge } from "@snappin/ui/components/badge";
import { cn } from "@snappin/ui/lib/utils";
import {
  IntegrationStatus,
  statusLabel,
} from "@snappin/shared/integration/status.enum";
import { Button } from "@snappin/ui/components/button";
import { Spinner } from "@snappin/ui/assets/svg/spinner";

export const GoogleDrive = () => {
  const router = useRouter();
  const { redirectToOAuthConsentScreen, loading } = useOAuthRedirect();
  const [isLoading, setIsLoading] = useState(false);
  const utils = trpc.useUtils();
  const openConfirm = useConfirmStore((s) => s.openConfirm);
  const { integration } = useIntegration({
    integration: { enabled: true, appSlug: AppSlug.GOOGLE_DRIVE },
  });

  const connected = integration?.data;

  const needReAuthorization = connected?.reAuthenticationRequired;

  const deleteIntegration = trpc.integration.removeIntegration.useMutation({
    onSuccess() {
      toast.success("Integration deleted successfully");
      utils.integration.getIntegration.invalidate();
      setIsLoading(false);
      router.push("/integrations");
    },
    onError() {
      setIsLoading(false);
      toast.error("Failed to delete integration");
    },
  });

  const handleReAuthorization = () => {
    if (!connected!.appSlug) return;
    setIsLoading(true);
    redirectToOAuthConsentScreen({
      appSlug: connected!.appSlug as AppSlug,
      redirectAfterPath: `/integrations`,
      reAuthenticate: { integrationId: connected!._id! },
    });
  };

  const removeIntegration = () => {
    if (!connected!._id || !connected!.appSlug) return;
    openConfirm({
      title: "Disconnect integration",
      description: "Are you sure that you want to delete this integration?",
      confirmLabel: "Disconnect",
      destructive: true,
      size: "sm",
      onConfirm: () => {
        setIsLoading(true);
        deleteIntegration.mutate({
          integrationId: connected!._id!,
          appSlug: connected!.appSlug!,
        });
      },
    });
  };

  const status = integration?.status as IntegrationStatus;
  const config = status ? statusLabel[status] : null;
  const isConnected = !!connected;

  return (
    <IntegrationCard>
      <IntegrationCardHeader>
        <IntegrationCardIcon icon={appMetadata.google_drive.iconifyIcon} />
        <IntegrationCardHeaderMain>
          <IntegrationCardTitle>
            {appMetadata.google_drive.name}
          </IntegrationCardTitle>
          {status && status == "reauth_required" && (
            <Badge
              size="sm"
              variant={config?.variant}
              appearance={config?.label ? "outline" : "ghost"}
              className={cn(
                "text-start bg-transparent border-transparent px-0 text-xs justify-start",
                !config?.label && "text-muted-foreground",
              )}
            >
              {config?.label ?? "Not Connected"}
            </Badge>
          )}
          {connected?.identifierEmail && (
            <span className="text-muted-foreground text-xs">
              {connected?.identifierEmail}
            </span>
          )}
        </IntegrationCardHeaderMain>
      </IntegrationCardHeader>
      <IntegrationCardContent>
        {appMetadata?.google_drive?.description}
      </IntegrationCardContent>
      <IntegrationCardFooter>
        <div className={cn("w-full flex gap-2")}>
          <Button
            variant={
              needReAuthorization
                ? "warning"
                : isConnected
                  ? "destructive_light"
                  : "outline"
            }
            onClick={
              needReAuthorization
                ? handleReAuthorization
                : isConnected
                  ? removeIntegration
                  : () =>
                      redirectToOAuthConsentScreen({
                        appSlug: appMetadata.google_drive.slug,
                        redirectAfterPath: "/integrations",
                      })
            }
            disabled={isLoading || loading == AppSlug.GOOGLE_DRIVE}
          >
            {(isLoading || loading) && (
              <Spinner
                className={cn(
                  needReAuthorization
                    ? "text-yellow-800"
                    : isConnected
                      ? "text-destructive"
                      : "",
                )}
              />
            )}
            {needReAuthorization
              ? "Reauthorize"
              : isConnected
                ? "Disconnect"
                : "Connect"}
          </Button>
        </div>
      </IntegrationCardFooter>
    </IntegrationCard>
    // <Integration
    //   name={appMetadata.google_drive.name}
    //   description={appMetadata.google_drive.description}
    //   icon={appMetadata.google_drive.iconifyIcon}
    //   appSlug={appMetadata.google_drive.slug}
    //   isComingSoon={appMetadata.google_drive.isComingSoon}
    //   note={appMetadata.google_drive.disclaimer}
    //   isLoading={integration.isLoading}
    //   isConnected={!!connected}
    //   hint={connected?.identifierEmail ?? ""}
    //   connectLoading={loading}
    //   isProgress={isLoading}
    //   reAuthorizationNeeded={needReAuthorization ?? false}
    //   onReAuthorization={handleReAuthorization}
    //   integration={integration?.data}
    //   onConnectClick={() =>
    //     redirectToOAuthConsentScreen({
    //       appSlug: appMetadata.google_drive.slug,
    //       redirectAfterPath: "/integrations",
    //     })
    //   }
    //   onDisconnectClick={() => removeIntegration()}
    // />
  );
};
