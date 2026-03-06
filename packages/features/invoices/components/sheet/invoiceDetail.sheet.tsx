import { trpc } from "@snappin/features/trpc/react/client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@snappin/ui/components/dialog";
import React from "react";
import { Button } from "@snappin/ui/components/button";
import { getDomainFromEmail } from "../../utils/getDomainFromEmail";
import { SourceKind } from "@snappin/shared/apps/app.schema";
import { getLogoByDomain } from "@snappin/ui/components/logo/getLogo";
import { Spinner } from "@snappin/ui/assets/svg/spinner";
import { TUpdateInvoice } from "@snappin/features/trpc/router/invoice/update.schema";
import { IoIosArrowBack } from "react-icons/io";
import { PdfViewer } from "@snappin/ui/components/pdf-viewer";
import { DetailCardAction } from "@snappin/ui/components/detailCard";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@snappin/ui/components/tabs";
import { BasicInformationInvoice } from "./basicInformation.invoice";
import { LineItemsInvoice } from "./lineItems.invoice";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { Small } from "@snappin/ui/components/typography";

type SectionProps = { title: string; children: React.ReactNode };

export const InvoiceSection = ({ title, children }: SectionProps) => (
  <div className="flex flex-col gap-4 min-w-[14vw] max-w-[18vw]">
    <h6 className="font-semibold tracking-tight font-onest">{title}</h6>
    <div className="flex flex-col gap-4">{children}</div>
  </div>
);

export type InvoicePatch = TUpdateInvoice["data"];

export const InvoiceDetailSheet = ({ invoiceId }: { invoiceId: string }) => {
  const { data, isLoading: isInvoiceDataLoading } =
    trpc.invoices.getInvoice.useQuery(
      { invoiceId: invoiceId! },
      {
        enabled: !!invoiceId,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: false,
        retry: 1,
      },
    );

  const documentId = data?.extraction?.documentId;

  const { data: docData, isLoading: isDocLoading } =
    trpc.invoices.getInvoiceDocumentUrl.useQuery(
      { documentId: documentId! },
      {
        enabled: !!documentId,
        staleTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: false,
        retry: 1,
      },
    );

  const domain =
    data?.extraction?.source?.kind === SourceKind.INTEGRATION &&
    data?.extraction?.source?.metadata?.from
      ? getDomainFromEmail(data.extraction.source.metadata.from)
      : data?.vendor?.emailId
        ? getDomainFromEmail(data?.vendor?.emailId)
        : data?.vendor?.name;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DetailCardAction
          icon={<HiOutlinePencilAlt size={16} />}
          label="Edit"
        />
      </DialogTrigger>
      <DialogContent className="md:min-w-5xl p-0 h-[90vh]">
        {/* ── Header ── */}
        <DialogHeader className="border-b mr-0 p-6">
          <DialogTitle>{data?.vendor?.name ?? "Unknown"}</DialogTitle>
        </DialogHeader>

        {isDocLoading || isInvoiceDataLoading ? (
          <div className="flex justify-center items-center min-h-[80vh]">
            <Spinner className="size-10 text-gray-6" />
          </div>
        ) : (
          <div className="flex flex-1 flex-col md:flex-row  min-h-0 overflow-hidden">
            {/* ── Right panel: PDF viewer ── */}
            <div className="md:flex-1 flex flex-col gap-2 max-w-3/5">
              <div className="w-full relative inline-flex h-fit p-2 pt-0 flex-col text-start items-start gap-2 justify-start overflow-hidden">
                {isDocLoading ? (
                  <Spinner />
                ) : docData?.url ? (
                  <div className="overflow-hidden w-full">
                    <PdfViewer
                      url={docData?.url}
                      className="overflow-hidden max-w-xl w-full h-[80vh]"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center rounded-2xl border border-border text-muted-foreground bg-muted/20">
                    No document
                  </div>
                )}
              </div>
            </div>

            {/* ── Left panel: Basic info (tabbed) + Line items below ── */}
            <div className="shrink-0 max-w-lg pl-4 overflow-y-hidden">
              <BasicInformationInvoice invoiceId={invoiceId} data={data} />
              {/* Line items always visible below basic info */}
              <LineItemsInvoice invoiceId={invoiceId} data={data} />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
