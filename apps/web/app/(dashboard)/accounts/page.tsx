import React from "react";
import {
  Dashboard,
  DashboardActions,
  DashboardContent,
  DashboardDescription,
  DashboardHeader,
  DashboardHeaderMain,
  DashboardTitle,
} from "../_components/dashboardLayout";
import { Table } from "./_components/table";
import { SelectProvider } from "./_components/selectProvider";
import { IntegrationListTable } from "@snappin/features/integration/components/integration.table";

export default function Page() {
  return (
    <Dashboard>
      <IntegrationListTable />
    </Dashboard>
  );
}
