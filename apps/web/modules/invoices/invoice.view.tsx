"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Dashboard,
  DashboardActions,
  DashboardContent,
  DashboardDescription,
  // DashboardDescription,
  DashboardHeader,
  DashboardHeaderMain,
  DashboardTitle,
} from "../../components/layout/dashboardLayout";
import { InvoiceListTable } from "@snappin/features/invoices/components/table/invoice.table";
import { ManualInvoiceUploadDialog } from "@snappin/features/invoices/components/manualInvoiceUpload.dialog";
import { FilterInvoice } from "@snappin/features/invoices/components/filter/filterByCategory";
import { Input, InputWrapper } from "@snappin/ui/components/input";
import { ExportAll } from "@snappin/features/export/components/exportAll";
import { Kbd, KbdGroup } from "@snappin/ui/components/kbd";
import { Icon } from "@iconify/react";
import { useInvoices } from "@snappin/features/invoices/hooks/useInvoices";
import { DashboardLoading } from "../../components/progress/loading";
import { InvoiceEmpty } from "./invoice.empty";

export const InvoiceView = () => {
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const { invoices, isLoading } = useInvoices();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/") {
        e.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (isLoading) return <DashboardLoading />;

  return (
    <Dashboard
    // sidePanel={<InvoiceDetail invoiceId={selectedInvoiceId ?? ""} />}
    // sidePanelClassName="sticky top-0 max-h-[100vh]"
    >
      <DashboardHeader>
        <DashboardHeaderMain>
          <DashboardTitle>Documents</DashboardTitle>
          <DashboardDescription>
            List of documents collected from various sources
          </DashboardDescription>
        </DashboardHeaderMain>
        <DashboardActions>
          <InputWrapper className="max-w-xs">
            <Icon icon="majesticons:search-line" />
            <Input
              ref={searchRef}
              placeholder="Search for something"
              className="placeholder:font-medium text-[13px]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <KbdGroup>
              <Kbd>/</Kbd>
            </KbdGroup>
          </InputWrapper>
          <FilterInvoice />
          <ExportAll />
          <ManualInvoiceUploadDialog />
        </DashboardActions>
      </DashboardHeader>
      <DashboardContent>
        {!invoices || invoices.data.length <= 0 ? (
          <InvoiceEmpty />
        ) : (
          <InvoiceListTable search={search} />
        )}
      </DashboardContent>
    </Dashboard>
  );
};
