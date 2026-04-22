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
import { useIntegration } from "@snappin/features/integration/hooks/useIntegration";
import React, { useState } from "react";
import { cn } from "@snappin/ui/lib/utils";
import { Button } from "@snappin/ui/components/button";
import { NewMobileScannerDialog } from "@snappin/features/mobileScanners/components/newMobileScanner.dialog";

export const Whatsapp = () => {
  // const router = useRouter();
  // const { redirectToOAuthConsentScreen, loading } = useOAuthRedirect();
  // const [isLoading, setIsLoading] = useState(false);
  // const utils = trpc.useUtils();
  // const openConfirm = useConfirmStore((s) => s.openConfirm);

  const { connectedMobileScanners } = useIntegration({
    connectedMobileScanners: true,
  });
  const [open, setOpen] = useState(false);

  // const needReAuthorization = connected?.reAuthenticationRequired;

  // const deleteIntegration = trpc.integration.removeIntegration.useMutation({
  //   onSuccess() {
  //     toast.success("Integration deleted successfully");
  //     utils.integration.getIntegration.invalidate();
  //     setIsLoading(false);
  //     router.push("/integrations");
  //   },
  //   onError() {
  //     setIsLoading(false);
  //     toast.error("Failed to delete integration");
  //   },
  // });

  // const handleReAuthorization = () => {
  //   if (!connected!.appSlug) return;
  //   setIsLoading(true);
  //   redirectToOAuthConsentScreen({
  //     appSlug: connected!.appSlug as AppSlug,
  //     redirectAfterPath: `/integrations`,
  //     reAuthenticate: { integrationId: connected!._id! },
  //   });
  // };

  // const removeIntegration = () => {
  //   if (!connected!._id || !connected!.appSlug) return;
  //   openConfirm({
  //     title: "Disconnect integration",
  //     description: "Are you sure that you want to delete this integration?",
  //     confirmLabel: "Disconnect",
  //     destructive: true,
  //     size: "sm",
  //     onConfirm: () => {
  //       setIsLoading(true);
  //       deleteIntegration.mutate({
  //         integrationId: connected!._id!,
  //         appSlug: connected!.appSlug!,
  //       });
  //     },
  //   });
  // };

  // const isConnected = !!connected;

  return (
    <IntegrationCard>
      <IntegrationCardHeader>
        <IntegrationCardIcon icon={appMetadata.whatsapp.iconifyIcon} />
        <IntegrationCardHeaderMain>
          <IntegrationCardTitle>
            {appMetadata.whatsapp.name}
          </IntegrationCardTitle>
        </IntegrationCardHeaderMain>
      </IntegrationCardHeader>
      <IntegrationCardContent>
        {appMetadata?.whatsapp?.description}
      </IntegrationCardContent>
      <IntegrationCardFooter>
        <div className={cn("w-full flex items-center gap-2")}>
          {connectedMobileScanners && connectedMobileScanners?.length > 0 && (
            <span className="text-xs font-normal flex items-center gap-1 text-green-4">{connectedMobileScanners?.length} scanners connected</span>
          )}
          <Button
            variant={
              connectedMobileScanners && connectedMobileScanners?.length > 0 ? "secondary" : "outline"
            }
            onClick={() => setOpen((prev) => !prev)}
          >
            {connectedMobileScanners && connectedMobileScanners?.length > 0 ? "Manage" : "Connect"}
          </Button>
          <NewMobileScannerDialog open={open} setOpen={setOpen} />
        </div>
      </IntegrationCardFooter>
    </IntegrationCard>
  );
};
