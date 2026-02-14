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
import { NewScanDialog } from "@snappin/features/retroSearch/components/newScanDialog";
import { ExtraSmall, H5, Paragraph } from "@snappin/ui/components/typography";
import { Icon } from "@iconify/react";

export const RetroSearchPage = () => {
  return (
    <Dashboard>
      <DashboardContent>
        <div className="flex flex-col gap-10 items-center">
          <div>
            <DashboardHeader>
              <DashboardHeaderMain className="flex flex-col items-center text-center max-w-sm">
                <DashboardTitle>Retroactive Search</DashboardTitle>
                <DashboardDescription>
                  Scan your past emails to automatically find and extract
                  invoices you may have missed.
                </DashboardDescription>
              </DashboardHeaderMain>
            </DashboardHeader>
          </div>
          <NewScanDialog />
        </div>

        <div className="mt-18 max-w-md mx-auto">
          <H5>All Scans</H5>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
            <div className="bg-gray-4 p-3 rounded-xl">
              <Paragraph className="text-muted-foreground">Last scan <span className="text-xs">(UTC)</span></Paragraph>
              <Paragraph>15 mins ago</Paragraph>
            </div>
            <div className="bg-gray-4 p-3 rounded-xl">
              <Paragraph className="text-muted-foreground">Next scan <span className="text-xs">(UTC)</span></Paragraph>
              <Paragraph>in 45 mins</Paragraph>
            </div>
          </div>
          <ExtraSmall className="flex items-center gap-1 mt-2"><Icon icon={"fluent:info-12-regular"} />Inbox monitoring scan runs every hour to detect new invoices.</ExtraSmall>
        
          {/* <IntegrationListTable /> */}
        </div>
      </DashboardContent>
    </Dashboard>
  );
};
