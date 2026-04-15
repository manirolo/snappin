import { appMetadata } from "@snappin/apps/app.metadata";
import { Integration } from "@snappin/features/integration/components/integrationCard";
import { useOAuthRedirect } from "@snappin/features/auth/redirectToOAuthScreen";
import { useIntegration } from "@snappin/features/integration/hooks/useIntegration";
import { AppSlug } from "@snappin/shared/apps/app.schema";
import { useRouter } from "next/navigation";
import { trpc } from "@snappin/features/trpc/react/client";
import toast from "react-hot-toast";
import { useState } from "react";
import { useConfirmStore } from "@snappin/ui/components/alert/fn/store";
import { XeroIntegration } from "@snappin/shared/integration/integration.schema";

export const Xero = () => {
  const router = useRouter();
  const { redirectToOAuthConsentScreen, loading } = useOAuthRedirect();
  const [isLoading, setIsLoading] = useState(false);
  const utils = trpc.useUtils();
  const openConfirm = useConfirmStore((s) => s.openConfirm);
  const { integration } = useIntegration({
    integration: { enabled: true, appSlug: AppSlug.XERO },
  });

  const connected = integration?.data as XeroIntegration;

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
      name={appMetadata.xero.name}
      description={appMetadata.xero.description}
      icon={appMetadata.xero.iconifyIcon}
      appSlug={appMetadata.xero.slug}
      isComingSoon={appMetadata.xero.isComingSoon}
      note={appMetadata.xero.disclaimer}
      isLoading={integration.isLoading}
      isConnected={!!connected}
      hint={connected?.metadata?.orgName ?? ""}
      connectLoading={loading}
      isProgress={isLoading}
      reAuthorizationNeeded={needReAuthorization ?? false}
      onReAuthorization={handleReAuthorization}
      integration={integration?.data}
      onConnectClick={() =>
        redirectToOAuthConsentScreen({
          appSlug: appMetadata.xero.slug,
          redirectAfterPath: "/integrations",
        })
      }
      onDisconnectClick={() => removeIntegration()}
    />
  );
};
