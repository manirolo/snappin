"use client";

import React from "react";
import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardHeaderMain,
  DashboardTitle,
  DashboardDescription,
} from "../../components/layout/dashboardLayout";
import { AppStore } from "./app-store/appStore";

export const IntegrationsPage = () => {
  return (
    <Dashboard>
      <DashboardHeader>
        <DashboardHeaderMain className="items-center">
          <DashboardTitle>Integrations</DashboardTitle>
          <DashboardDescription>
            Connect other apps and service with Snappin
          </DashboardDescription>
        </DashboardHeaderMain>
      </DashboardHeader>
      <DashboardContent>
        <div className="mb-5">
          <AppStore />
        </div>
      </DashboardContent>
    </Dashboard>
  );
};
