"use client";

import { useInvoiceFilterStore } from "@snappin/features/invoice/components/filter/invoiceFilter.store";
import { useInvoices } from "@snappin/features/invoice/hooks/useInvoices";
import { trpc } from "@snappin/features/trpc/react/client";
import { Spinner } from "@snappin/ui/assets/svg/spinner";
import { Button } from "@snappin/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@snappin/ui/components/dropdown-menu";
import React from "react";
import { triggerDownload } from "../utils/triggerDownload";
import toast from "react-hot-toast";
import { TExport } from "@snappin/features/trpc/router/export/export.schema";
import { HugeiconsIcon } from "@hugeicons/react";
import { Download01Icon } from "@hugeicons-pro/core-stroke-rounded";

export const ExportAll = ({
  selectedInvoiceIds = [],
}: {
  selectedInvoiceIds?: string[];
}) => {
  const { total } = useInvoices();
  const {
    vendorIds,
    senderEmails,
    recipientEmails,
    currencies,
    invoiceRecipients,
  } = useInvoiceFilterStore();

  const filters = {
    vendorIds,
    senderEmails,
    recipientEmails,
    currencies,
    invoiceRecipients,
  };

  const exportCSV = trpc.export.csv.useMutation({
    onSuccess: ({ data, filename, mimeType }) => {
      triggerDownload(data, filename, mimeType);
    },
  });
  const exportZip = trpc.export.zip.useMutation({
    onSuccess: ({ downloadUrl }) => {
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "invoices.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    onError: () => {
      toast.error("Failed to export as ZIP");
    },
  });
  const exportPayload: TExport = {
    filters, 
    selectedIds:
      selectedInvoiceIds && selectedInvoiceIds.length > 0
        ? selectedInvoiceIds
        : undefined,
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          variant="outline"
          size="icon"
          // className="pr-3.5"
          asChild
        >
          <div>
            <HugeiconsIcon icon={Download01Icon} />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              exportCSV.mutate(exportPayload);
            }}
            disabled={exportCSV.isPending}
          >
            {exportCSV.isPending && <Spinner />}
            Download .csv
          </DropdownMenuItem>
          {/* <DropdownMenuItem>Download .pdf</DropdownMenuItem> */}
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              exportZip.mutate(exportPayload);
            }}
            disabled={exportZip.isPending}
          >
            {exportZip.isPending && <Spinner />}
            Download .zip
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            {selectedInvoiceIds?.length ? selectedInvoiceIds.length : total} invoices will be downloaded
          </DropdownMenuLabel>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
