"use client";

import { Button } from "@snappin/ui/components/button";
import {
  FileUpload,
  FileUploadTrigger,
} from "@snappin/ui/components/file-upload";
import React from "react";
import { trpc } from "@snappin/features/trpc/react/client";
import { useInvoiceProcessStatus } from "../hooks/useInvoiceProcessStatus";
import toast from "react-hot-toast";
import { useInvoiceProcessingStore } from "./invoiceProcessing.store";

export type InvoiceProcessingStatus = {
  total: number;
  done: boolean;
  statusCounts: Record<string, number>;
} | null;

export const ManualInvoiceUpload = () => {
  const [files, setFiles] = React.useState<File[]>([]);
  const [jobId, setJobId] = React.useState<string | null>(null);
  const { setProcessingStatus, reset } = useInvoiceProcessingStore();

  const uploadInvoice = trpc.invoices.uploadInvoice.useMutation({
    onSuccess: (data) => {
      setFiles([]);
      if (data?.jobId) setJobId(data.jobId);
      toast.success("New invoice(s) uploaded for extraction");
    },
    onError: (error) => {
      console.error("Upload failed:", error);
      toast.error("Invoice extraction failed");
      setFiles([]);
    },
  });

  useInvoiceProcessStatus(jobId, {
    onStatus: (status) => {
      setProcessingStatus(status);
      // reset after done
      if (status.done) {
        setJobId(null);
        reset();
      }
    },
  });

  const handleUpload = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0 || uploadInvoice.isPending) return;

    const attachments = await Promise.all(
      acceptedFiles.map(async (file) => ({
        fileName: file.name,
        mimeType: file.type,
        attachmentId: null,
        buffer: Buffer.from(await file.arrayBuffer()),
      })),
    );

    uploadInvoice.mutate({ attachments });
  };

  return (
    <FileUpload
      maxFiles={2}
      maxSize={5 * 1024 * 1024}
      value={files}
      onValueChange={setFiles}
      onAccept={handleUpload}
      multiple
    >
      <FileUploadTrigger asChild>
        <Button size="sm" variant={"mono"} disabled={uploadInvoice.isPending}>
          {uploadInvoice.isPending ? "Uploading..." : "Upload"}
        </Button>
      </FileUploadTrigger>
    </FileUpload>
  );
};
