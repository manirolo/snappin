"use client";

import React from "react";
import {
  Dashboard,
  DashboardContent,
  DashboardDescription,
  DashboardHeader,
  DashboardHeaderMain,
  DashboardActions,
  DashboardTitle,
} from "../../components/layout/dashboardLayout";
import { NewScanDialog } from "@snappin/features/retroSearch/components/newScanDialog";
import { ScanListTable } from "@snappin/features/retroSearch/components/table/scan.table";

export const RetroSearchPage = () => {
  return (
    <Dashboard>
      <DashboardHeader>
        <DashboardHeaderMain>
          <DashboardTitle>Retroactive extractions</DashboardTitle>
          <DashboardDescription>
            Scan your past emails to automatically find and extract invoices you
            may have missed.
          </DashboardDescription>
        </DashboardHeaderMain>
        <DashboardActions>
          
        <NewScanDialog />
        </DashboardActions>
      </DashboardHeader>
      <DashboardContent>

        <ScanListTable />
      </DashboardContent>
    </Dashboard>
  );
};
