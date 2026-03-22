"use client";

import { useParams } from "next/navigation";
import { trpc } from "@snappin/features/trpc/react/client";
import { skipToken } from "@tanstack/react-query";
import { AppSlug } from "@snappin/shared/apps/app.schema";
import {
  EditViewRef,
  IntegrationEditRegistry,
} from "./app-store/integration.edit.registry";
import { IntegrationEditLayout } from "./integration.edit.layout";
import { IntegrationNoResult } from "./integration.no_result";
import { DashboardLoading } from "../../components/progress/loading";
// import { IntegrationResource } from "@snappin/shared/integration/integration.schema";

export const IntegrationsEditView = () => {
  const params = useParams();
  const id = params?.integrationId as string | undefined;

  const { data: integration, isLoading } =
    trpc.integration.getIntegration.useQuery(
      id ? { integrationId: id } : skipToken,
      { refetchOnWindowFocus: false, retry: 1 },
    );

  if (isLoading) return <DashboardLoading />;

  const record = integration;
  if (!record?.appSlug) return <IntegrationNoResult />;

  const EditView = IntegrationEditRegistry[record.appSlug as AppSlug];
  if (!EditView) return <IntegrationNoResult />;

  return (
    <IntegrationEditLayout integration={integration}>
      {(
        ref: React.RefObject<EditViewRef | null>,
        setIsDirty: React.Dispatch<React.SetStateAction<boolean>>,
        setIsSaving: React.Dispatch<React.SetStateAction<boolean>>,
      ) => {
        const EditView =
          IntegrationEditRegistry[integration.appSlug as AppSlug];
        if (!EditView) return <IntegrationNoResult />;

        return (
          <EditView
            ref={ref}
            integration={integration}
            onDirtyChange={setIsDirty}
            onSavingChange={setIsSaving}
          />
        );
      }}
    </IntegrationEditLayout>
  );
};
