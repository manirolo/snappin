"use client";

import React from "react";
import {
  Dashboard,
  DashboardContent,
  DashboardDescription,
  // DashboardDescription,
  DashboardHeader,
  DashboardHeaderMain,
  DashboardTitle,
} from "../../components/layout/dashboardLayout";
import { InvoiceListTable } from "@snappin/features/invoices/components/table/invoice.table";
import { useInvoices } from "@snappin/features/invoices/hooks/useInvoices";
import { DashboardLoading } from "../../components/progress/loading";
import { InvoiceEmpty } from "./invoice.empty";

export const InvoiceView = () => {
  const { invoices, isLoading } = useInvoices();

  if (isLoading) return <DashboardLoading />;

  return (
    <Dashboard>
      <DashboardHeader>
        <DashboardHeaderMain>
          <DashboardTitle>Documents</DashboardTitle>
          <DashboardDescription>
            List of documents collected from various sources
          </DashboardDescription>
        </DashboardHeaderMain>
      </DashboardHeader>
      <DashboardContent>
        {!invoices || invoices.data.length <= 0 ? (
          <InvoiceEmpty />
        ) : (
          <InvoiceListTable  />
        )}
      </DashboardContent>
    </Dashboard>
  );
};
