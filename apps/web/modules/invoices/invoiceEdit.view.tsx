"use client";

import React, { useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { skipToken } from "@tanstack/react-query";
import { trpc } from "@snappin/features/trpc/react/client";
import {
  Dashboard,
  DashboardContent,
  DashboardHeader,
  DashboardHeaderMain,
  DashboardActions,
  DashboardTitle,
  DashboardDescription,
} from "../../components/layout/dashboardLayout";
import { DashboardLoading } from "../../components/progress/loading";
import { getDomainFromEmail } from "@snappin/features/invoices/utils/getDomainFromEmail";
import { SourceKind } from "@snappin/shared/apps/app.schema";
import { getLogoByDomain } from "@snappin/ui/components/logo/getLogo";
import { capitalize } from "@snappin/lib/string/capitalize";
import { Button } from "@snappin/ui/components/button";
import { Spinner } from "@snappin/ui/assets/svg/spinner";
import { PdfViewer } from "@snappin/ui/components/pdf-viewer";
import {
  BasicInformationInvoice,
  BasicInformationInvoiceHandle,
} from "@snappin/features/invoices/components/sheet/basicInformation.invoice";
import {
  LineItemsInvoice,
  LineItemsInvoiceHandle,
} from "@snappin/features/invoices/components/sheet/lineItems.invoice";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@snappin/ui/components/tabs";
import { HiOutlineX } from "react-icons/hi";
import { InvoiceActions } from "@snappin/features/invoices/components/invoiceActions";
import { InvoiceAttachmentEmpty } from "./components/empty/invoiceAttachment.empty";

type TabKey = "basic" | "lineItems";
type FormState = { isDirty: boolean; isSaving: boolean };

export const InvoiceEditView = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.invoiceId as string | undefined;

  const basicInfoRef = useRef<BasicInformationInvoiceHandle>(null);
  const lineItemsRef = useRef<LineItemsInvoiceHandle>(null);

  const [activeTab, setActiveTab] = useState<TabKey>("basic");
  const [basicState, setBasicState] = useState<FormState>({ isDirty: false, isSaving: false });
  const [lineItemsState, setLineItemsState] = useState<FormState>({ isDirty: false, isSaving: false });

  const handleBasicStateChange     = useCallback((s: FormState) => setBasicState(s),     []);
  const handleLineItemsStateChange = useCallback((s: FormState) => setLineItemsState(s), []);

  // Save button reflects the active tab only
  const activeState = activeTab === "basic" ? basicState : lineItemsState;
  const handleSave  = () =>
    activeTab === "basic"
      ? basicInfoRef.current?.save()
      : lineItemsRef.current?.save();

  const { data: invoice, isLoading: isInvoiceLoading } =
    trpc.invoices.getInvoice.useQuery(id ? { invoiceId: id } : skipToken, {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
      retry: 1,
    });

  const documentId = invoice?.extraction?.documentId;

  const { data: doc, isLoading: isDocLoading } =
    trpc.invoices.getInvoiceDocumentUrl.useQuery(
      documentId ? { documentId } : skipToken,
      { refetchOnWindowFocus: false, refetchIntervalInBackground: false, retry: 1 },
    );

  if (isInvoiceLoading) return <DashboardLoading />;

  const senderAddress =
    invoice?.extraction?.source?.kind === SourceKind.INTEGRATION &&
    invoice?.extraction?.source?.metadata?.from
      ? getDomainFromEmail(invoice.extraction.source.metadata.from)
      : invoice?.vendor?.name;

  return (
    <Dashboard>
      <DashboardHeader className="sticky top-0 bg-background z-20 border-b py-4 mb-0">
        <DashboardHeaderMain className="flex flex-row gap-4 items-center justify-start">
          {getLogoByDomain(senderAddress ?? "unknown", "size-10", "text-lg")}
          <div className="flex flex-col gap-0">
            <DashboardTitle>{invoice?.vendor?.name}</DashboardTitle>
            <DashboardDescription>
              {capitalize(invoice?.invoice?.metadata?.documentType ?? "invoice")}
            </DashboardDescription>
          </div>
        </DashboardHeaderMain>

        <DashboardActions className="divide divide-x space-x-4">
          <div className="space-x-2 flex pr-5">
            <Button
              radius="full"
              variant="mono"
              className="p-5 min-w-20"
              disabled={!activeState.isDirty || activeState.isSaving}
              onClick={handleSave}
            >
              {activeState.isSaving ? <Spinner className="size-4" /> : "Save"}
            </Button>

            <InvoiceActions invoiceId={id ?? ""} side="bottom" sideOffset={8}>
              <Button radius="full" variant="outline" className="p-5">
                More Actions
              </Button>
            </InvoiceActions>
          </div>

          <Button
            radius="full"
            variant="outline"
            className="min-w-fit min-h-fit p-2"
            onClick={() => router.push("/bookkeeping/documents")}
          >
            <HiOutlineX className="size-5" />
          </Button>
        </DashboardActions>
      </DashboardHeader>

      <DashboardContent className="p-0 mt-0 justify-between h-screen overflow-visible">
        <div className="flex w-full sticky top-0 left-0 h-screen overflow-hidden">
          <div className="w-8/12 flex justify-center items-center h-screen overflow-hidden">
            {isDocLoading ? (
              <Spinner />
            ) : doc?.url ? (
              <div className="min-w-full h-screen overflow-hidden">
                <PdfViewer url={doc.url} className="min-w-full h-screen" />
              </div>
            ) : (
              <InvoiceAttachmentEmpty />
            )}
          </div>

          <div className="max-w-4/12 w-full h-screen overflow-hidden">
            <Tabs
              defaultValue="basic"
              className="mx-auto max-w-md"
              onValueChange={(v) => setActiveTab(v as TabKey)}
            >
              <TabsList size="lg" className="my-4 w-auto mb-8">
                <TabsTrigger value="basic">Basic Information</TabsTrigger>
                <TabsTrigger value="lineItems">Line Items</TabsTrigger>
              </TabsList>

              <TabsContent value="basic">
                <BasicInformationInvoice
                  ref={basicInfoRef}
                  invoiceId={id ?? ""}
                  data={invoice}
                  onStateChange={handleBasicStateChange}
                />
              </TabsContent>

              <TabsContent value="lineItems">
                <LineItemsInvoice
                  ref={lineItemsRef}
                  invoiceId={id ?? ""}
                  data={invoice}
                  onStateChange={handleLineItemsStateChange}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DashboardContent>
    </Dashboard>
  );
};