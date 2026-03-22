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
import { Small } from "@snappin/ui/components/typography";
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
          <DashboardTitle>Retroactive extractions</DashboardTitle>
          <DashboardDescription>
            Scan your past emails to automatically find and extract invoices you
            may have missed.
          </DashboardDescription>
        </DashboardHeaderMain>
        <DashboardActions>
          <Button
            variant="dim"
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
        <Small className="text-xs md:text-xs mb-2 ml-auto w-fit">Note: Displaying last 10 scans</Small>
        <ScanListTable />
      </DashboardContent>
    </Dashboard>
  );
};
