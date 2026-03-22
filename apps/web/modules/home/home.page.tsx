"use client";

import React from "react";
import {
  Dashboard,
  DashboardContent,
} from "../../components/layout/dashboardLayout";
import { useIntegration } from "@snappin/features/integration/hooks/useIntegration";
import { WaitingForFirstSourceConnection } from "./components/waitingForFirstSourceConnection";
import { DashboardLoading } from "../../components/progress/loading";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkBadge01Icon } from "@hugeicons-pro/core-bulk-rounded";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@snappin/ui/components/empty";
import { Button } from "@snappin/ui/components/button";
import { useRouter } from "next/navigation";

export const Home = () => {
  const { connectedEmailAccounts, isLoading } = useIntegration({
    connectedEmailAccounts: true,
  });
  const router = useRouter();

  if (isLoading) return <DashboardLoading />;

  return (
    <Dashboard>
      <DashboardContent>
        {(!connectedEmailAccounts || connectedEmailAccounts.length === 0) && (
          <WaitingForFirstSourceConnection />
        )}
        {connectedEmailAccounts && connectedEmailAccounts.length > 0 && (
          <Empty>
            <EmptyHeader>
              <EmptyMedia>
                <HugeiconsIcon
                  icon={CheckmarkBadge01Icon}
                  className="size-14 text-primary"
                />
              </EmptyMedia>
              <EmptyTitle>All set, relax</EmptyTitle>
              <EmptyDescription>
                We actively monitoring your connected sources
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button onClick={() => router.push("/bookkeeping/documents")}>
                View invoices
              </Button>
            </EmptyContent>
          </Empty>
        )}
      </DashboardContent>
    </Dashboard>
  );
};
