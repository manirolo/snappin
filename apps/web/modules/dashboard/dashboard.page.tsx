"use client";

import React from "react";
import {
  Dashboard,
  DashboardContent,
} from "../../components/layout/dashboardLayout";
import { InvoiceListTable } from "@snappin/features/invoices/components/table/invoice.table";
import { AccountsCompactListTable } from "@snappin/features/accounts/components/account.table.compact";
import { MobileScannersCompactListTable } from "@snappin/features/mobileScanners/components/mobileScanners.table.compact";

export const Home = () => {
  return (
    <Dashboard>
      <DashboardContent>
        <div className="flex flex-col lg:flex-row gap-4 h-hit">
          <div className="flex flex-col w-full lg:w-1/2 gap-4">
            <AccountsCompactListTable />
            <MobileScannersCompactListTable />
          </div>
          <div className="rounded-2xl h-full w-full">
            <InvoiceListTable />
          </div>
        </div>
      </DashboardContent>
    </Dashboard>
  );
};
