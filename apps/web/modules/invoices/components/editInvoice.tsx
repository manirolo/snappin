import { getDomainFromEmail } from "@snappin/features/invoices/utils/getDomainFromEmail";
import { capitalize } from "@snappin/lib/string/capitalize";
import { SourceKind } from "@snappin/shared/apps/app.schema";
import { trpc } from "@snappin/features/trpc/react/client";
import { DetailCardAction } from "@snappin/ui/components/detailCard";
import DialogContent, {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@snappin/ui/components/dialog";
import { getLogoByDomain } from "@snappin/ui/components/logo/getLogo";
import { PdfViewer } from "@snappin/ui/components/pdf-viewer";
import { Small } from "@snappin/ui/components/typography";
import { skipToken } from "@tanstack/react-query";
import React from "react";
import { HiOutlinePencilAlt } from "react-icons/hi";

export const EditInvoice = ({ invoiceId }: { invoiceId: string }) => {
  const { data: invoice, isLoading: isInvoiceLoading } =
    trpc.invoices.getInvoice.useQuery(
      { invoiceId },
      {
        refetchOnWindowFocus: false,
        refetchIntervalInBackground: false,
        retry: 1,
      },
    );

  const documentId = invoice?.extraction?.documentId;

  const { data: doc } = trpc.invoices.getInvoiceDocumentUrl.useQuery(
    documentId ? { documentId } : skipToken,
    {
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
      retry: 1,
    },
  );

  const senderAddress =
    invoice?.extraction?.source?.kind === SourceKind.INTEGRATION &&
    invoice?.extraction?.source?.metadata?.from
      ? getDomainFromEmail(invoice.extraction.source.metadata.from)
      : invoice?.vendor?.name;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DetailCardAction
          icon={<HiOutlinePencilAlt size={16} />}
          label="Edit"
        />
      </DialogTrigger>
      <DialogContent className="md:min-w-5xl overflow-hidden">
        <DialogHeader className="flex flex-row gap-2">
          {getLogoByDomain(senderAddress ?? "unknown", "size-12", "text-lg")}
          <div className="flex flex-col gap-1">
            <DialogTitle>{invoice?.vendor?.name}</DialogTitle>
            <DialogDescription>
              {capitalize(
                invoice?.invoice?.metadata?.documentType ?? "invoice",
              )}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="max-w-xl h-[70vh] overflow-hidden">
          {doc?.url ? (
            <PdfViewer
              url={doc.url}
              className="h-full w-full"
              pdfClassName="w-full h-full"
            />
          ) : (
            <Small>No document</Small>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
