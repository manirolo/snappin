import { appMetadata } from "@snappin/apps/app.metadata";
import { Integration } from "@snappin/features/integration/components/integrationCard";
import { useOAuthRedirect } from "@snappin/features/auth/redirectToOAuthScreen";
import { useIntegration } from "@snappin/features/integration/hooks/useIntegration";
import { useRouter } from "next/navigation";
import { AppSlug } from "@snappin/shared/apps/app.schema";
import { IntegrationResource } from "@snappin/shared/integration/integration.schema";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { trpc } from "@snappin/features/trpc/react/client";
import toast from "react-hot-toast";
import { useConfirmStore } from "@snappin/ui/components/alert/fn/store";

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

  return (
    <Integration
      name={appMetadata.google_drive.name}
      description={appMetadata.google_drive.description}
      icon={appMetadata.google_drive.iconifyIcon}
      appSlug={appMetadata.google_drive.slug}
      isComingSoon={appMetadata.google_drive.isComingSoon}
      note={appMetadata.google_drive.disclaimer}
      isLoading={integration.isLoading}
      isConnected={!!connected}
      hint={connected?.identifierEmail ?? ""}
      connectLoading={loading}
      isProgress={isLoading}
      reAuthorizationNeeded={needReAuthorization ?? false}
      onReAuthorization={handleReAuthorization}
      integration={integration?.data}
      onConnectClick={() =>
        redirectToOAuthConsentScreen({
          appSlug: appMetadata.google_drive.slug,
          redirectAfterPath: "/integrations",
        })
      }
      onDisconnectClick={() => removeIntegration()}
    />
  );
};

type GoogleDriveEditProps = {
  integration: IntegrationResource;
  onDirtyChange: (dirty: boolean) => void;
  onSavingChange: (saving: boolean) => void;
};

/** Integration detail / save UI: Google Drive has no editable workspace fields yet. */
export const EditGoogleDrive = forwardRef<
  { save: () => void | Promise<void>; isPending?: boolean },
  GoogleDriveEditProps
>(function EditGoogleDrive(_props, ref) {
  useImperativeHandle(ref, () => ({
    save: () => {},
    isPending: false,
  }));
  return (
    <p className="text-sm text-muted-foreground">
      There are no additional settings for this connection.
    </p>
  );
});
