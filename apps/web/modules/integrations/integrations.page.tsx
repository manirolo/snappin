"use client";

import React from "react";
import {
  Dashboard,
  DashboardContent,
  DashboardDescription,
  DashboardHeader,
  DashboardHeaderMain,
  DashboardTitle,
} from "../../components/layout/dashboardLayout";
import { IntegrationListTable } from "@snappin/features/integration/components/integration.table";
import { AppStore } from "./app-store/appStore";

export const IntegrationsPage = () => {
  return (
    <Dashboard>
      <DashboardHeader>
        <DashboardHeaderMain>
          <DashboardTitle>All Apps</DashboardTitle>
        </DashboardHeaderMain>
      </DashboardHeader>
      <DashboardContent>
        <AppStore />
      </DashboardContent>
    </Dashboard>
  );
};
