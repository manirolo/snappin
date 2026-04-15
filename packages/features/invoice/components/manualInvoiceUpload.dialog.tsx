"use client";

import { Button } from "@snappin/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogLabel,
} from "@snappin/ui/components/dialog";
import React, { useRef, useState, useCallback } from "react";
import { trpc } from "@snappin/features/trpc/react/client";
import toast from "react-hot-toast";
import { useInvoiceProcessingStore } from "./invoiceProcessing.store";
import { Spinner } from "@snappin/ui/assets/svg/spinner";
import { Upload04Icon } from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { UpgradeButton } from "@snappin/features/billing/components/upgradeButton";
import { useUsage } from "@snappin/features/billing/hooks/useUsage";

export const ManualInvoiceUploadDialog = () => {
  const [open, setOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setProcessingStatus, reset } = useInvoiceProcessingStore();
  const utils = trpc.useUtils();
  const { invalidate } = utils.invoices.getInvoices;
  const { usage, isLoading: isUsageLoading } = useUsage();

  const uploadTemp = trpc.invoices.uploadTempInvoice.useMutation({
    onSuccess: () => {
      toast.success("New invoices added to extraction");
      setOpen(false);
      setProcessingStatus(true);
    },
    onError: () => {
      toast.error("Failed to stage file for upload");
      reset();
    },
  });

  const extractInvoice = trpc.invoices.extractInvoice.useMutation({
    onSuccess: (data) => {
      invalidate();
      toast.success(`Invoice from ${data.vendorName} extracted`);
      reset();
    },
    onError: () => {
      toast.error("Invoice extraction failed");
      reset();
    },
  });

  const handleFiles = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;

      for (const file of acceptedFiles) {
        const buffer = Buffer.from(await file.arrayBuffer());

        const result = await uploadTemp.mutateAsync({
          kind: "buffer",
          fileName: file.name,
          mimeType: file.type,
          buffer,
        });

        if (result?.fileId) {
          extractInvoice.mutate({ requestId: result.requestId });
        }
      }
    },
    [uploadTemp, extractInvoice],
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length) setTimeout(() => handleFiles(files), 0);
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      ["application/pdf", "image/png", "image/jpeg"].includes(f.type),
    );
    if (files.length) handleFiles(files);
    else toast.error("Only PDF, PNG, or JPG files are accepted");
  };

  const isPending = uploadTemp.isPending;

  return (
    <>
      {/* Trigger Button */}
      <UpgradeButton
        popupId="manual-upload-dialog"
        isLoading={isUsageLoading}
        limitReached={
          !!(
            usage &&
            (usage.usage?.invoices ?? 0) >= (usage.limits?.invoices ?? 0)
          )
        }
        description={`You've reached the limit of ${usage?.limits?.invoices} invoices. To extract more, upgrade to a higher plan.`}
        onClick={() => setOpen(true)}
      >
        <Button
          variant="dim"
          disabled={isPending}
          // className="pr-3.5"
          asChild
        >
          <div className="flex items-center">
            {isPending && <Spinner className="size-4" />}
            Upload
          </div>
        </Button>
      </UpgradeButton>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full sm:max-w-xl flex md:flex-col">
          <DialogHeader>
            <DialogLabel>Upload</DialogLabel>
            <DialogTitle>Upload document</DialogTitle>
            <DialogDescription>
              Upload your document for AI extraction. Supports PDF, PNG, JPG.
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 pt-5">
            {/* Hidden file input */}
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              multiple
              className="sr-only"
              onChange={handleInputChange}
            />

            {/* Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => !isPending && inputRef.current?.click()}
              className={`
              mt-2 flex flex-col items-center justify-center gap-4
              rounded-2xl border-2 border-dashed p-10 text-center
              transition-colors duration-200 cursor-pointer
              ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-blue-300 hover:bg-muted/10"
              }
              ${isPending ? "pointer-events-none opacity-60" : ""}
            `}
            >
              {isPending ? (
                <>
                  <Spinner className="size-10 text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Uploading your invoice...
                  </p>
                </>
              ) : (
                <>
                  <div className="rounded-full bg-muted p-4">
                    <HugeiconsIcon
                      icon={Upload04Icon}
                      className="size-7 text-muted-foreground"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {isDragging
                        ? "Drop files here"
                        : "Drag & drop files here"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      or click anywhere to browse
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground/60">
                    PDF, PNG, JPG up to 10MB
                  </p>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
