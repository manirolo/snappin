"use client"

import React from "react";
import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardTitle,
} from "../../components/layout/dashboardLayout";
import {
  Card,
  CardDescription,
  CardTitle,
  CardContent,
} from "@snappin/ui/components/card";
import { Button } from "@snappin/ui/components/button";
import { useIntegration } from "@snappin/features/integration/hooks/useIntegration";
import { WaitingForFirstSourceConnection } from "./components/waitingForFirstSourceConnection";
import { DotSpinner } from "@snappin/ui/assets/svg/dotSpinner";
import Link from "next/link";

export const Home = () => {
  const { connectedEmailAccounts, isLoading } = useIntegration({
    connectedEmailAccounts: true,
  });

  if (isLoading) return <DotSpinner />;

  return (
    <Dashboard>
      <DashboardHeader>
        <DashboardTitle>Overview</DashboardTitle>
      </DashboardHeader>
      {(!connectedEmailAccounts || connectedEmailAccounts.length === 0) && (
        <WaitingForFirstSourceConnection />
      )}
      {(connectedEmailAccounts && connectedEmailAccounts.length > 0) &&<DashboardContent>
        <div>
          <Card>
            <CardContent className="border-t-0">
              <div className="flex flex-col gap-2 mb-5">
                <CardTitle>Congratulations</CardTitle>
                <CardDescription>
                  We have take in-charge for invoice extraction
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="mono" size={"sm"} asChild>
                  <Link href="/invoices">View Invoices</Link>
                </Button>
                <Button variant="mono" size={"sm"} asChild>
                  <Link href="/retroSearch">Find Past Invoices</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardContent>}
    </Dashboard>
  );
};
