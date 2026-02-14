"use client";

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
  CardHeader,
  CardTitle,
  CardContent,
} from "@snappin/ui/components/card";
import { Button } from "@snappin/ui/components/button";
import { useInvoices } from "@snappin/features/invoices/hooks/useInvoices";
import { useIntegration } from "@snappin/features/integration/hooks/useIntegration";
import { WatchingForFirstInvoice } from "./components/watchingForFirstInvoice";
import { WaitingForFirstSourceConnection } from "./components/waitingForFirstSourceConnection";
import { DotSpinner } from "@snappin/ui/assets/svg/dotSpinner";
import Link from "next/link";

export const Home = () => {
  const { invoices } = useInvoices();
  const { connectedSource, isLoading } = useIntegration({
    connectedSource: true,
  });

  if (isLoading) return <DotSpinner />;

  return (
    <Dashboard>
      <DashboardHeader>
        <DashboardTitle>Overview</DashboardTitle>
      </DashboardHeader>
      {(!connectedSource || connectedSource.length === 0) && (
        <WaitingForFirstSourceConnection />
      )}
      {(connectedSource && connectedSource.length > 0) &&<DashboardContent>
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
                <Button size={"sm"} asChild>
                  <Link href="/invoices">View Invoices</Link>
                </Button>
                <Button size={"sm"} asChild>
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
