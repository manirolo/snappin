"use client";

import React, { useState } from "react";
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
import { AccountDetails } from "./components/accountDetail";

export const AccountView = () => {
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null,
  );
  return (
    <Dashboard
      sidePanel={<AccountDetails accountId={selectedAccountId ?? ""} />}
      sidePanelClassName="sticky top-0 min-h-[95vh]"
    >
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
        <AccountsListTable onRowClick={(id) => setSelectedAccountId(id)} />
      </DashboardContent>
    </Dashboard>
  );
};
