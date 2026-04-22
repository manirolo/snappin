"use client";

import React, { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { AddInvoiceIcon } from "@hugeicons-pro/core-bulk-rounded";
import { ManualInvoiceUploadDialog } from "@snappin/features/invoices/components/manualInvoiceUpload.dialog";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyContent,
} from "@snappin/ui/components/empty";
import { Spinner } from "@snappin/ui/assets/svg/spinner";
import { useInvoiceProcessingStore } from "@snappin/features/invoices/components/invoiceProcessing.store";

export const InvoiceEmpty = () => {
  const processingStatus = useInvoiceProcessingStore((s) => s.processingStatus);
  const [openInvoiceUpload, setOpenInvoiceUpload] = useState<boolean>(false);

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <HugeiconsIcon
            icon={AddInvoiceIcon}
            className="size-14 text-primary"
          />
        </EmptyMedia>
        <EmptyTitle>No invoices</EmptyTitle>
        <EmptyDescription>
          Connect email accounts for automatic invoice extraction or upload a
          document
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div>
          {processingStatus && (
            <div className="flex items-center gap-2 mb-6 text-muted-foreground">
              <Spinner className="size-4" />
              Processing uploaded documents. Just a moment
            </div>
          )}

          <ManualInvoiceUploadDialog
            open={openInvoiceUpload}
            setOpen={setOpenInvoiceUpload}
          />
        </div>
      </EmptyContent>
    </Empty>
  );
};
