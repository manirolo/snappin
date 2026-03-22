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
import { Upload04Icon } from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { Small } from "@snappin/ui/components/typography";
import { Image } from "@snappin/ui/components/Image";

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
      <Button
        variant="outline"
        size="sm"
        disabled={isPending}
        onClick={() => setOpen(true)}
        // className="pr-3.5"
        asChild
      >
        <div className="flex items-center">
          {isPending && <Spinner className="size-4" />}
          Upload
        </div>
      </Button>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-full sm:max-w-xl flex md:flex-col">
          <DialogHeader>
            <DialogTitle>Upload</DialogTitle>
            <DialogDescription>
              Drag & drop your files or click to browse. Supports PDF, PNG, JPG.
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 pt-0">
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
          <div className="w-[94%] h-[0.2px] bg-gray-5 mt-1 mb-4 mx-4"></div>
          <div className="px-4 pb-4 space-y-2">
            <Small>Import from external services</Small>
            <Button variant="dim" className="w-full mt-2">
              <div className="flex max-w-50 w-full gap-3">
                <Image
                  className="size-4.5 object-contain"
                  src={"/images/vendors/logos/google_drive.png"}
                  alt={"Google drive's logo"}
                />
                Import from Google Drive
              </div>
            </Button>
            <Button variant="dim" className="w-full">
              <div className="flex justify-start w-full max-w-50 gap-3">
                <Image
                  className="size-5 object-contain rounded-full"
                  src={"/images/vendors/logos/dropbox.png"}
                  alt={"Dropbox's logo"}
                />
                Import from Dropbox
              </div>
            </Button>
            <Button variant="dim" className="w-full">
              <div className="flex justify-start w-full max-w-50 gap-3">
                <Image
                  className="size-5 object-contain rounded-full"
                  src={"/images/vendors/logos/onedrive.png"}
                  alt={"OneDrive's logo"}
                />
                Import from OneDrive
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
