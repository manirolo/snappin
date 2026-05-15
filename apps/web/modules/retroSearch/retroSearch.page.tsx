"use client";

import React, { useState } from "react";
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
import { Button } from "@snappin/ui/components/button";
import { HiOutlineRefresh } from "react-icons/hi";
import { trpc } from "@snappin/features/trpc/react/client";
import toast from "react-hot-toast";

export const RetroSearchPage = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const utils = trpc.useUtils();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await utils.retroSearch.getScans.invalidate();
    } finally {
      setIsRefreshing(false);
      toast.success("Scan history refreshed")
    }
  };

  return (
    <Dashboard>
      <DashboardHeader>
        <DashboardHeaderMain>
          <DashboardTitle>Retroactive</DashboardTitle>
          <DashboardDescription>
            Scan your past emails to find and extract invoices you
            may have missed.
          </DashboardDescription>
        </DashboardHeaderMain>
        <DashboardActions>
          <Button
            variant="outline"
            size={"sm"}
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <HiOutlineRefresh className={isRefreshing ? "animate-spin" : ""} />
            Refresh
          </Button>
          <NewScanDialog />
        </DashboardActions>
      </DashboardHeader>
      <DashboardContent>
        <ScanListTable />
      </DashboardContent>
    </Dashboard>
  );
};
