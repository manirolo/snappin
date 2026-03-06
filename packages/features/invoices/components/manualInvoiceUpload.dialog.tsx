"use client";

import { Button } from "@snappin/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@snappin/ui/components/dialog";
import React, { useRef, useState, useCallback } from "react";
import { trpc } from "@snappin/features/trpc/react/client";
import toast from "react-hot-toast";
import { useInvoiceProcessingStore } from "./invoiceProcessing.store";
import { Spinner } from "@snappin/ui/assets/svg/spinner";
import { Add01Icon, Upload04Icon } from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";

export const ManualInvoiceUploadDialog = () => {
  const [open, setOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setProcessingStatus, reset } = useInvoiceProcessingStore();
  const utils = trpc.useUtils();
  const { invalidate } = utils.invoices.getInvoices;

  const uploadTemp = trpc.invoices.uploadTempInvoice.useMutation({
    onSuccess: () => {
      toast.success("New invoices added to extraction");
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
      setOpen(false);
    },
    onError: () => {
      toast.error("Invoice extraction failed");
      reset();
    },
  });

  const handleFiles = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;
      setProcessingStatus(true);

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
    [uploadTemp, extractInvoice, setProcessingStatus]
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
      ["application/pdf", "image/png", "image/jpeg"].includes(f.type)
    );
    if (files.length) handleFiles(files);
    else toast.error("Only PDF, PNG, or JPG files are accepted");
  };

  const isPending = uploadTemp.isPending;

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant="outline"
        size="md"
        radius="full"
        className="min-w-fit pr-4"
        disabled={isPending}
        onClick={() => setOpen(true)}
        asChild
      >
        <div className="flex items-center">
          {isPending ? (
            <Spinner className="size-4" />
          ) : (
            <HugeiconsIcon icon={Add01Icon} />
          )}
          Upload
        </div>
      </Button>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl flex flex-col">
          <DialogHeader>
            <DialogTitle>Upload</DialogTitle>
            <DialogDescription>
              Drag & drop your files or click to browse. Supports PDF, PNG, JPG.
            </DialogDescription>
          </DialogHeader>

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
                  <HugeiconsIcon icon={Upload04Icon} className="size-7 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-sm">
                    {isDragging ? "Drop files here" : "Drag & drop files here"}
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
        </DialogContent>
      </Dialog>
    </>
  );
};