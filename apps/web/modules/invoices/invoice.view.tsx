"use client";

import React from "react";
import {
  Dashboard,
  DashboardActions,
  DashboardContent,
  DashboardHeader,
  DashboardHeaderMain,
  DashboardTitle,
} from "../../components/layout/dashboardLayout";
import { InvoiceListTable } from "@snappin/features/invoices/components/invoiceTable/invoice.table";
import { OverviewHome } from "./components/overview.home";
import { FilterInvoice } from "@snappin/features/invoices/components/filter/filterByCategory";
import { Input, InputWrapper } from "@snappin/ui/components/input";
import { Icon } from "@iconify/react";

export const InvoiceView = () => {
  return (
    <Dashboard>
      <DashboardHeader>
        <DashboardHeaderMain>
          <div className="flex gap-2">
            <DashboardTitle>Invoices</DashboardTitle>
          </div>
        </DashboardHeaderMain>
        <DashboardActions>
          <InputWrapper variant={"sm"}>
            <Icon icon="majesticons:search-line" />
            <Input placeholder="Search" variant={"sm"} />
          </InputWrapper>
          {/* <FilterByPeriod /> */}
          <FilterInvoice />
        </DashboardActions>
      </DashboardHeader>
      <DashboardContent>
        <div className="space-y-4">
          <InvoiceListTable toolbar={<OverviewHome />} />
        </div>
      </DashboardContent>
    </Dashboard>
  );
};
