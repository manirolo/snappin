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
import { MobileScannersListTable } from "@snappin/features/mobileScanners/components/mobileScanners.table";
import { NewMobileScannerDialog } from "./components/newMobileScanner.dialog";

export const MobileScannersView = () => {
  return (
    <Dashboard>
      <DashboardHeader>
        <DashboardHeaderMain>
          <DashboardTitle>Mobile Scanners</DashboardTitle>
          <DashboardDescription>
            Connect your scanners to start extracting invoices
          </DashboardDescription>
        </DashboardHeaderMain>
        <DashboardActions>
          <NewMobileScannerDialog />
        </DashboardActions>
      </DashboardHeader>
      <DashboardContent>
        <MobileScannersListTable />
      </DashboardContent>
    </Dashboard>
  );
};
