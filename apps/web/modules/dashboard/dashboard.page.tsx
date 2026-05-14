"use client";

import React from "react";
import {
  Dashboard,
  DashboardContent,
} from "../../components/layout/dashboardLayout";
import { InvoiceListTable } from "@snappin/features/invoices/components/table/invoice.table";

export const Home = () => {
  return (
    <Dashboard>
      <DashboardContent>
        <InvoiceListTable />
      </DashboardContent>
    </Dashboard>
  );
};
