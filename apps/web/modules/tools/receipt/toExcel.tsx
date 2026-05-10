"use client";

import { useCallback, useState } from "react";
import {
  Tool,
  ToolContent,
  ToolDescription,
  ToolHeader,
  ToolLabel,
  ToolTitle,
} from "../../../components/layout/toolLayout";
import { FileDropzone } from "@snappin/features/invoice/components/fileDropzone";
import { trpc } from "@snappin/features/trpc/react/client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ReceiptDetails } from "./components/receiptDetails";
import type { RouterOutputs } from "@snappin/features/trpc/_root";
import { triggerDownload } from "@snappin/features/export/utils/triggerDownload";

export const ReceiptToExcel = () => {
  type ReceiptData = RouterOutputs["tool"]["receipt"]["convertToExcel"]["data"];

  const { user } = useUser();
  const router = useRouter();
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [error, setError] = useState<null | string>(null);
  const [receiptId, setReceiptId] = useState<null | string>(null);

  const uploadTemp = trpc.tool.receipt.convertToExcel.useMutation({
    onSuccess: (data) => {
      if (!data.data) return;
      setReceipt(data.data); // ← full { invoice, vendor }
      setReceiptId(data.data?._id?.toString() ?? null);
    },
    onError: (err) => {
      setError(err.message ?? "Something went wrong!. Please try again later.");
    },
  });

  const handleFiles = useCallback(
    async (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;

      if (!user)
        return router.push(
          "/signup?redirect_url=/tools/receipt-to-excel-converter",
        );

      for (const file of acceptedFiles) {
        const buffer = Buffer.from(await file.arrayBuffer());

        const result = await uploadTemp.mutateAsync({
          kind: "buffer",
          fileName: file.name,
          mimeType: file.type,
          buffer,
        });

        console.log(result);
      }
    },
    [uploadTemp, router, user],
  );

  const exportCSV = trpc.export.csv.useMutation({
    onSuccess: ({ data, filename, mimeType }) => {
      triggerDownload(data, filename, mimeType);
    },
  });

  return (
    <Tool>
      <ToolHeader>
        <ToolLabel rating={4.6}>Free tool</ToolLabel>
        <ToolTitle>Receipt to Excel Converter</ToolTitle>
        <ToolDescription>Convert receipt into Excel in seconds</ToolDescription>
      </ToolHeader>
      <ToolContent>
        <div className="flex max-w-2xl mx-auto flex-col gap-4 items-center">
          <FileDropzone
            isPending={uploadTemp.isPending}
            onFiles={handleFiles}
          />
          {error && <p className="text-destructive">{error}</p>}
        </div>

        <div>
          {receipt && (
            <ReceiptDetails
              data={receipt}
              onDownload={() => {
                /* your existing excel download handler */
                if (receiptId) {
                  return exportCSV.mutate({ selectedIds: [receiptId] });
                }
              }}
            />
          )}
        </div>
      </ToolContent>
    </Tool>
  );
};
