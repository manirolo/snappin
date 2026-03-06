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
import { Kbd, KbdGroup } from "@snappin/ui/components/kbd";
import { Icon } from "@iconify/react";
import { InvoiceDetail } from "./components/invoiceDetails";
import { useInvoices } from "@snappin/features/invoices/hooks/useInvoices";
import { HugeiconsIcon } from "@hugeicons/react";
import { DocumentAttachmentIcon } from "@hugeicons-pro/core-bulk-rounded";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@snappin/ui/components/empty";
import { DashboardLoading } from "../../components/progress/loading";

export const InvoiceView = () => {
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(
    null,
  );
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

  if (isLoading) return <DashboardLoading />

  if (!invoices)
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
          <Empty>
            <EmptyHeader>
              <EmptyMedia>
                <HugeiconsIcon
                  icon={DocumentAttachmentIcon}
                  className="size-14 text-primary"
                />
              </EmptyMedia>
              <EmptyTitle>No invoices yet</EmptyTitle>
              <EmptyDescription>
                Add and manage your favorite services.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </DashboardContent>
      </Dashboard>
    );
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
          <ManualInvoiceUploadDialog />
        </DashboardActions>
      </DashboardHeader>
      <DashboardContent>
        <div className="w-full"></div>
        <div className="flex flex-col gap-8 mt-6 mb-10">
          <InvoiceListTable
            search={search}
            onRowClick={(id) => setSelectedInvoiceId(id)}
          />
        </div>
      </DashboardContent>
    </Dashboard>
  );
};
