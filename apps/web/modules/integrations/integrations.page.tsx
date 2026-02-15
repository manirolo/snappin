"use client";

import React from "react";
import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardHeaderMain,
  DashboardTitle,
} from "../../components/layout/dashboardLayout";
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
