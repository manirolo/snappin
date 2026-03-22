"use client";

import React, { useRef, useCallback } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@snappin/features/trpc/react/client";
import { appMetadata } from "@snappin/apps/app.metadata";
import { AppSlug } from "@snappin/shared/apps/app.schema";
import { useConfirmStore } from "@snappin/ui/components/alert/fn/store";
import { Button } from "@snappin/ui/components/button";
import { Image } from "@snappin/ui/components/Image";
import { Spinner } from "@snappin/ui/assets/svg/spinner";
import { HiArrowSmLeft, HiChevronRight, HiOutlineTrash } from "react-icons/hi";
import { IntegrationNoResult } from "./integration.no_result";
import { EditViewRef } from "./app-store/integration.edit.registry";
import toast from "react-hot-toast";
import {
  Dashboard,
  DashboardHeader,
  DashboardHeaderMain,
  DashboardTitle,
  DashboardDescription,
  DashboardActions,
  DashboardContent,
} from "../../components/layout/dashboardLayout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@snappin/ui/components/dropdown-menu";
import { IntegrationResource } from "@snappin/shared/integration/integration.schema";
import { useOAuthRedirect } from "@snappin/features/auth/redirectToOAuthScreen";

type IntegrationEditLayoutProps = {
  integration: IntegrationResource;
  children: (
    ref: React.RefObject<EditViewRef | null>,
    setIsDirty: (v: boolean) => void,
    setIsSaving: (v: boolean) => void,
  ) => React.ReactNode;
};

export const IntegrationEditLayout = ({
  integration,
  children,
}: IntegrationEditLayoutProps) => {
  const router = useRouter();
  const openConfirm = useConfirmStore((s) => s.openConfirm);
  const utils = trpc.useUtils();
  const editViewRef = useRef<EditViewRef>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const setIsDirtyStable = useCallback((v: boolean) => setIsDirty(v), []);
  const setIsSavingStable = useCallback((v: boolean) => setIsSaving(v), []);
  const { redirectToOAuthConsentScreen, loading } = useOAuthRedirect(); // ✅

  const record = integration;

  const isReAuthLoading = loading === record.appSlug;
  const needReAuthorization = record.reAuthenticationRequired;

  const handleReAuthorization = () => {
    if (!record.appSlug) return;
    redirectToOAuthConsentScreen({
      appSlug: record.appSlug as AppSlug,
      redirectAfterPath: `/integrations/${record._id}`,
      reAuthenticate: { integrationId: record._id! },
    });
  };

  const deleteIntegration = trpc.integration.removeIntegration.useMutation({
    onSuccess() {
      toast.success("Integration deleted successfully");
      utils.integration.getIntegration.invalidate();
      setIsDeleting(false);
      router.push("/integrations");
    },
    onError() {
      setIsDeleting(false);
      toast.error("Failed to delete integration");
    },
  });

  if (!record?._id || !record?.appSlug) return <IntegrationNoResult />;

  const app = appMetadata[record.appSlug as AppSlug];

  const removeIntegration = () => {
    if (!record._id || !record.appSlug) return;
    openConfirm({
      title: "Delete integration",
      description: "Are you sure that you want to delete this integration?",
      confirmLabel: "Delete",
      destructive: true,
      size: "sm",
      onConfirm: () => {
        setIsDeleting(true);
        deleteIntegration.mutate({
          integrationId: record._id!,
          appSlug: record.appSlug!,
        });
      },
    });
  };

  return (
    <Dashboard>
      <div className="mb-6">
        <Button
          variant="link"
          size="sm"
          onClick={() => router.push("/integrations")}
        >
          <HiArrowSmLeft />
          Apps
        </Button>
      </div>
      <DashboardHeader>
        <DashboardHeaderMain>
          <div className="flex items-center gap-4">
            <Image
              className="size-8"
              src={app.logoUrl ?? ""}
              alt={app.name + "'s logo"}
            />
            <div>
              <DashboardTitle>{app.name}</DashboardTitle>
              <DashboardDescription>
                {record.identifierEmail}
              </DashboardDescription>
            </div>
          </div>
        </DashboardHeaderMain>
        <DashboardActions>
          {needReAuthorization ? (
            <Button
              variant="dim"
              disabled={isReAuthLoading}
              onClick={handleReAuthorization}
            >
              {isReAuthLoading && <Spinner />}
              Re-Authorize
            </Button>
          ) : (
            <Button
              radius="full"
              variant="mono"
              className="p-5 min-w-20"
              disabled={!isDirty || isSaving}
              onClick={() => editViewRef.current?.save()}
            >
              {isSaving ? <Spinner /> : "Save"}
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                radius="full"
                className="p-5 min-w-20"
              >
                More Actions <HiChevronRight />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="text-destructive bg-destructive/10"
                  onClick={removeIntegration}
                >
                  {isDeleting ? <Spinner /> : <HiOutlineTrash />}
                  Delete Integration
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </DashboardActions>
      </DashboardHeader>
      <DashboardContent>
        {children(editViewRef, setIsDirtyStable, setIsSavingStable)}
      </DashboardContent>
    </Dashboard>
  );
};
