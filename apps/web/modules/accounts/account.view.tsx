"use client";

import React from "react";
import {
  Dashboard,
  DashboardActions,
  DashboardContent,
  DashboardDescription,
  DashboardHeader,
  DashboardHeaderMain,
  DashboardTitle,
} from "../../components/layout/dashboardLayout";
import { AccountsListTable } from "@snappin/features/accounts/components/accounts.table";
import { SelectProvider } from "./components/selectProvider";
import { useAccounts } from "@snappin/features/accounts/hooks/useInvoices";
import { DashboardLoading } from "../../components/progress/loading";
import { AccountEmpty } from "./account.empty";

export const AccountView = () => {
  const { accounts, isLoading } = useAccounts();

  if (isLoading) return <DashboardLoading />;
  if (!accounts || accounts.length <= 0) return <AccountEmpty />;

  return (
    <Dashboard>
      <DashboardHeader>
        <DashboardHeaderMain>
          <DashboardTitle>Email Accounts</DashboardTitle>
          <DashboardDescription>
            Connect your email to start extracting invoices automatically
          </DashboardDescription>
        </DashboardHeaderMain>
        <DashboardActions>
          <SelectProvider />
        </DashboardActions>
      </DashboardHeader>
      <DashboardContent>
        <div className="max-w-6xl">
          <AccountsListTable />
        </div>
      </DashboardContent>
    </Dashboard>
  );
};
