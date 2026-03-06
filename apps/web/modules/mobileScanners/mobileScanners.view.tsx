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
import { Button } from "@snappin/ui/components/button";
import { MobileScannersListTable } from "@snappin/features/mobileScanners/components/mobileScanners.table";
import { Add01Icon } from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { MobileScannerDetails } from "./components/mobileScannerDetail";

export const MobileScannersView = () => {
  return (
    <Dashboard sidePanel={<MobileScannerDetails />}>
      <DashboardHeader>
        <DashboardHeaderMain>
          <DashboardTitle>Mobile Scanners</DashboardTitle>
          <DashboardDescription>
            Connect your scanners to start extracting invoices
          </DashboardDescription>
        </DashboardHeaderMain>
        <DashboardActions>
          <Button size="md" variant={"outline"} radius="full" className="min-w-fit">
            <HugeiconsIcon icon={Add01Icon} />
          </Button>
        </DashboardActions>
      </DashboardHeader>
      <DashboardContent>
        <MobileScannersListTable />
      </DashboardContent>
    </Dashboard>
  );
};
