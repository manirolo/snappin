import { appMetadata } from "@snappin/apps/app.metadata";
import { Integration } from "@snappin/features/integration/components/integrationCard";
import { useOAuthRedirect } from "@snappin/features/auth/redirectToOAuthScreen";
import { useIntegration } from "@snappin/features/integration/hooks/useIntegration";
import {
  DEFAULT_ORGANIZATION_STRATEGY,
  ORGANIZATION_STRATEGY_OPTIONS,
} from "@snappin/lib/storage/resolveStoragePaths";
import { useRouter } from "next/navigation";
import { AppSlug } from "@snappin/shared/apps/app.schema";
import { EditViewProps, EditViewRef } from "./integration.edit.registry";
import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useRef,
} from "react";
import { StorageOrganizationStrategy } from "@snappin/shared/integration/storage.schema";
import { trpc } from "@snappin/features/trpc/react/client";
import toast from "react-hot-toast";
import { IntegrationNoResult } from "../integration.no_result";
import { RadioGroup, RadioGroupItem } from "@snappin/ui/components/radio-group";
import { Label } from "@snappin/ui/components/label";
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

export const EditGoogleDrive = forwardRef<EditViewRef, EditViewProps>(
  ({ integration, onDirtyChange, onSavingChange }, ref) => {
    const config =
      integration.appSlug === AppSlug.GOOGLE_DRIVE ? integration.config : null;
    const savedStrategyRef = useRef<StorageOrganizationStrategy>(
      config?.organization?.strategy,
    );

    const [selected, setSelected] = useState<StorageOrganizationStrategy>(
      config?.organization?.strategy ?? DEFAULT_ORGANIZATION_STRATEGY,
    );
    const utils = trpc.useUtils();

    useEffect(() => {
      if (config?.organization?.strategy) {
        savedStrategyRef.current = config.organization.strategy;
        setSelected(config.organization.strategy);
        onDirtyChange(false);
      }
    }, [config?.organization?.strategy, onDirtyChange]);

    useImperativeHandle(ref, () => ({
      save: async () => {
        if (integration.appSlug !== AppSlug.GOOGLE_DRIVE || !integration._id)
          return;

        updateIntegration.mutate({
          integrationId: integration._id,
          data: {
            ...integration,
            config: {
              ...integration.config,
              organization: {
                ...integration.config.organization,
                strategy: selected,
              },
            },
          },
        });
      },
    }));

    if (!integration || !integration?.appSlug || !integration?._id)
      return <IntegrationNoResult />;

    const handleChange = (value: StorageOrganizationStrategy) => {
      setSelected(value);
      onDirtyChange(value !== savedStrategyRef.current);
    };

    const updateIntegration = trpc.integration.updateIntegration.useMutation({
      onMutate: () => {
        onSavingChange(true);
      },
      onSuccess: () => {
        savedStrategyRef.current = selected;
        if (!integration.appSlug || !integration?._id) return;
        utils.integration.getIntegration.invalidate({
          integrationId: integration._id,
        });
        toast.success("Integration updated");
        onSavingChange(false);
        onDirtyChange(false);
      },
      onError: () => {
        toast.error("Failed to update");
        onSavingChange(false);
      },
    });

    return (
      <div className="flex flex-col gap-3">
        <RadioGroup
          value={selected}
          onValueChange={handleChange}
          disabled={updateIntegration.isPending}
        >
          {ORGANIZATION_STRATEGY_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`flex items-center gap-4 cursor-pointer shadow border border-border/40 max-w-lg min-h-18 p-2.5 rounded-2xl transition-colors ${
                selected === option.value ? "bg-gray-4" : "bg-card"
              }`}
            >
              <RadioGroupItem value={option.value} id={option.value} />
              <div className="flex flex-col gap-1">
                <Label
                  htmlFor={option.value}
                  className="font-medium text-foreground cursor-pointer"
                >
                  {option.label}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {option.description}
                </p>
              </div>
            </label>
          ))}
        </RadioGroup>
      </div>
    );
  },
);

EditGoogleDrive.displayName = "EditGoogleDrive";
