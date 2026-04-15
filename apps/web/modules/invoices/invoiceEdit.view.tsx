"use client";

import React, { useRef, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { skipToken } from "@tanstack/react-query";
import { trpc } from "@snappin/features/trpc/react/client";
import {
  Dashboard,
  DashboardContent,
} from "../../components/layout/dashboardLayout";
import { DashboardLoading } from "../../components/progress/loading";
// import { getDomainFromEmail } from "@snappin/features/invoices/utils/getDomainFromEmail";
// import { SourceKind } from "@snappin/shared/apps/app.schema";
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
import { getLogoByDomain } from "@snappin/ui/components/logo/getLogo";
import { InvoiceResource } from "@snappin/shared/invoice/invoice.schema";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@snappin/ui/components/dialog";
import { SourceKind } from "@snappin/shared/apps/app.schema";
import { getDomainFromEmail } from "@snappin/features/invoices/utils/getDomainFromEmail";
import { Small } from "@snappin/ui/components/typography";
import currencyMap from "currency-symbol-map";
import { formatMinorAmount } from "@snappin/lib/amount/formatMinorAmount";
import { formatDate } from "@snappin/lib/date/formateDate";

type TabKey = "basic" | "lineItems";
type FormState = { isDirty: boolean; isSaving: boolean };

const InvoiceEditActions = ({
  isDirty,
  isSaving,
  invoiceId,
  onClick,
  invoice,
}: {
  isDirty: boolean;
  isSaving: boolean;
  invoiceId: string;
  onClick: () => void;
  invoice?: InvoiceResource;
}) => {
  return (
    <>
      <Button
        radius="full"
        variant="mono"
        className="p-5 min-w-20"
        disabled={!isDirty || isSaving}
        onClick={onClick}
      >
        {isSaving ? <Spinner className="size-4" /> : "Save"}
      </Button>

      <InvoiceActions
        invoiceId={invoiceId}
        side="bottom"
        invoice={invoice}
        sideOffset={8}
      >
        <Button radius="full" variant="outline" className="p-5">
          More Actions
        </Button>
      </InvoiceActions>
    </>
  );
};

export const InvoiceEditView = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.invoiceId as string | undefined;

  const basicInfoRef = useRef<BasicInformationInvoiceHandle>(null);
  const lineItemsRef = useRef<LineItemsInvoiceHandle>(null);

  const [activeTab, setActiveTab] = useState<TabKey>("basic");
  const [basicState, setBasicState] = useState<FormState>({
    isDirty: false,
    isSaving: false,
  });
  const [lineItemsState, setLineItemsState] = useState<FormState>({
    isDirty: false,
    isSaving: false,
  });

  const handleBasicStateChange = useCallback(
    (s: FormState) => setBasicState(s),
    [],
  );
  const handleLineItemsStateChange = useCallback(
    (s: FormState) => setLineItemsState(s),
    [],
  );

  // Save button reflects the active tab only
  const activeState = activeTab === "basic" ? basicState : lineItemsState;
  const handleSave = () =>
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
      {
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: false,
        retry: 1,
      },
    );

  if (isInvoiceLoading) return <DashboardLoading />;

  const senderAddress =
    invoice?.extraction?.source?.kind === SourceKind.INTEGRATION &&
    invoice?.extraction?.source?.metadata?.from
      ? getDomainFromEmail(invoice.extraction.source.metadata.from)
      : invoice?.vendor?.name;

  const invoiceData = invoice as InvoiceResource | undefined;

  return (
    <Dashboard>
      {/* <DashboardHeader className="sticky justify-start top-0 bg-background z-20 border-b py-4 xl:px-4 mb-0">

        <DashboardActions className="divide lg:divide-x space-x-4">
          
        </DashboardActions>
      </DashboardHeader> */}

      <DashboardContent className="p-0 mt-0 justify-between md:px-0 xl:px-0 h-screen overflow-visible">
        <div className="flex flex-col md:flex-row w-full sticky top-0 left-0 h-screen overflow-hidden">
          <div className="w-6/12 xl:w-1/2 lg:flex hidden bg-bg-1/50 justify-center items-center h-screen overflow-hidden">
            <div className="max-w-md pt-12 mx-auto h-screen overflow-hidden">
              <div>
                <div className="flex gap-2 items-center">
                  {getLogoByDomain(
                    senderAddress ?? "unknown",
                    "size-9",
                    "text-lg",
                  )}
                  <div>
                    <h6>{invoice?.vendor?.name}</h6>
                    {/* <span className="text-fg-2 text-sm">{capitalize(invoice?.payment?.status ?? "unpaid")} {invoice?.payment?.status == "partial" && "paid"} {invoice?.totals?.currency} {invoice?.totals?.total}</span> */}
                    <span className="text-fg-2 text-sm">
                      {invoice?.description}
                    </span>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="mt-18 flex gap-8">
                    <div className="space-y-1">
                      <Small>Invoice date</Small>
                      <Small className="text-fg-4">
                        {formatDate("MMM_DD_YYYY", invoice?.invoiceDate)}
                      </Small>
                    </div>
                    <div className="space-y-1">
                      <Small>Amount</Small>
                      <Small className="text-fg-4">
                        {currencyMap(invoice?.totals?.currency ?? "usd")}
                        {formatMinorAmount(invoice?.totals?.total)}
                      </Small>
                    </div>
                  </div>

                  <div>
                    <div className="space-y-1">
                      <div className="text-fg-2 text-sm">Attachment</div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="inverse"
                            className="px-0! text-start justify-start"
                          >
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl w-full">
                          <DialogHeader>
                            <DialogTitle>Attachment</DialogTitle>
                          </DialogHeader>
                          <div className="p-4">
                            {isDocLoading ? (
                              <Spinner />
                            ) : doc?.url ? (
                              <div className="min-w-full overflow-hidden">
                                <PdfViewer
                                  url={doc.url}
                                  className="min-w-full h-[80vh]"
                                />
                              </div>
                            ) : (
                              <InvoiceAttachmentEmpty />
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full xl:max-w-1/2 h-screen overflow-y-auto">
            <div className="flex items-center gap-4 py-4 px-2 ml-auto w-fit">
              <div className="space-x-2 hidden lg:flex pr-5">
                <InvoiceEditActions
                  invoiceId={id ?? ""}
                  isDirty={activeState.isDirty}
                  isSaving={activeState.isSaving}
                  onClick={handleSave}
                  invoice={invoiceData}
                />
              </div>

              <Button
                radius="full"
                variant="outline"
                className="min-w-fit absolute top-5 right-5 md:top-0 md:right-0 md:relative min-h-fit p-2"
                onClick={() => router.push("/dashboard")}
              >
                <HiOutlineX className="size-5" />
              </Button>
            </div>
            <Tabs
              defaultValue="basic"
              className="xl:px-4 2xl:px-0 mx-auto max-w-lg"
              onValueChange={(v) => setActiveTab(v as TabKey)}
            >
              <TabsList size="lg" className="my-4 bg-bg-2 w-auto mb-8">
                <TabsTrigger
                  value="basic"
                  className="data-[state=active]:text-fg-4"
                >
                  Basic Information
                </TabsTrigger>
                <TabsTrigger
                  value="lineItems"
                  className="data-[state=active]:text-fg-4"
                >
                  Line Items
                </TabsTrigger>
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

        <div className="lg:hidden absolute bottom-0 left-0 right-0 flex shadow-xs drop-shadow-3xl items-center min-h-12 bg-background py-4 border-t">
          <div className="ml-auto flex items-center gap-2">
            <InvoiceEditActions
              invoiceId={id ?? ""}
              isDirty={activeState.isDirty}
              isSaving={activeState.isSaving}
              onClick={handleSave}
            />
          </div>
        </div>
      </DashboardContent>
    </Dashboard>
  );
};
