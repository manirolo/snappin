"use client";

import { useCallback, useState } from "react";
import {
  Tool,
  ToolBenefit,
  ToolBenefitItem,
  ToolContent,
  ToolDescription,
  ToolHeader,
  ToolInput,
  ToolLabel,
  ToolOutput,
  ToolTitle,
  ToolAd,
  ToolGuide,
  ToolGuideItem,
  ToolFaq,
  ToolReview,
} from "../../../components/layout/toolLayout";
import { FileDropzone } from "@snappin/features/invoice/components/fileDropzone";
import { trpc } from "@snappin/features/trpc/react/client";
import { ReceiptDetails } from "./components/receiptDetails";
import type { RouterOutputs } from "@snappin/features/trpc/_root";
import { triggerDownload } from "@snappin/features/export/utils/triggerDownload";
import {
  HiOutlineDocumentText,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
} from "react-icons/hi";

const FAQ_ITEMS = [
  {
    id: "q1",
    question: "What kinds of receipts can I upload?",
    answer:
      "Pretty much anything — grocery runs, restaurant bills, online orders, clothing stores, you name it. If it's a receipt, we can read it.",
  },
  {
    id: "q2",
    question: "How do I get started?",
    answer:
      "Just take a photo of your receipt or drop in a PDF. That's it. We'll pull out all the details in a few seconds.",
  },
  {
    id: "q3",
    question: "Can I use this to keep track of my spending?",
    answer:
      "Yes! All your uploaded receipts are saved and organized in one place. No more hunting through emails or bags — everything is right there when you need it.",
  },
  {
    id: "q4",
    question: "What info does it actually pull from my receipt?",
    answer:
      "Store name, date, every item you bought, prices, any discounts, taxes, and the final total. Basically everything that's printed on there.",
  },
  {
    id: "q5",
    question: "I need to return something — can this help?",
    answer:
      "For sure. Head to your dashboard, find the receipt, and you've got your proof of purchase ready to go. No digging required.",
  },
  {
    id: "q6",
    question: "Does it work with Amazon or other online store emails?",
    answer:
      "Yes! You can manually upload the PDF or send it straight to us via WhatsApp — works just as well as a physical receipt, no matter which store or country you ordered from.",
  },
  {
    id: "q7",
    question: "How many receipts can I upload for free?",
    answer:
      "You get 10 free extractions to try it out. If you want unlimited uploads and auto-syncing, you can upgrade anytime.",
  },
  {
    id: "q8",
    question: "Can it automatically grab receipts from my email?",
    answer:
      "Yes — connect your Gmail or Outlook and we'll quietly pick up any receipt or order confirmation that lands in your inbox. No manual uploading needed.",
  },
  {
    id: "q9",
    question: "My receipt photo isn't great — will it still work?",
    answer:
      "Usually yes. We handle faded prints, slight blurs, and crinkled paper pretty well. Just make sure the text isn't cut off and you should be fine.",
  },
  {
    id: "q10",
    question: "Can I export everything to a spreadsheet?",
    answer:
      "Of course. Download your data as CSV or Excel and plug it straight into whatever budgeting tool or spreadsheet you already use.",
  },
];

const REVIEW_ITEMS = [
  {
    id: "r1",
    name: "Sarah M.",
    rating: 5,
    comment:
      "I used to manually type every receipt into a spreadsheet. Now I just upload and it's done. Honestly can't believe I wasted so much time before.",
  },
  {
    id: "r2",
    name: "James T.",
    rating: 4,
    comment:
      "Really accurate on most receipts. Had one faded thermal print that needed a small correction but everything else came through perfectly.",
  },
  {
    id: "r3",
    name: "Emily R.",
    rating: 5,
    comment:
      "Perfect for tracking business expenses. I upload all my receipts at the end of the week and export one clean Excel file. My accountant loves it.",
  },
  {
    id: "r4",
    name: "Carlos D.",
    rating: 5,
    comment:
      "Tried a few tools like this — this one is by far the fastest. Uploads process in seconds and the Excel output is clean with no extra cleanup needed.",
  },
  {
    id: "r5",
    name: "Nina W.",
    rating: 4,
    comment:
      "Works really well for grocery and restaurant receipts. Would love support for splitting receipts across multiple categories but overall very happy.",
  },
  {
    id: "r6",
    name: "Tom B.",
    rating: 5,
    comment:
      "Game changer for freelancers. I just forward all my email receipts and download one spreadsheet at the end of the month for my taxes.",
  },
  {
    id: "r7",
    name: "Aisha L.",
    rating: 5,
    comment:
      "The Excel file it generates is so well organized — store name, date, items, totals, all in the right columns. Saves me at least an hour every week.",
  },
  {
    id: "r8",
    name: "Marcus P.",
    rating: 4,
    comment:
      "Really solid tool. Works great on printed and digital receipts alike. The free tier was enough to convince me to upgrade within a day.",
  },
  {
    id: "r9",
    name: "Leila H.",
    rating: 5,
    comment:
      "I run a small business and this has completely replaced my manual expense tracking. Upload, export, done. Couldn't be simpler.",
  },
];

export const ReceiptToExcel = () => {
  type ReceiptData = RouterOutputs["tool"]["receipt"]["convertToExcel"]["data"];
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [error, setError] = useState<null | string>(null);
  const [receiptId, setReceiptId] = useState<null | string>(null);
  const utils = trpc.useUtils();

  const uploadTemp = trpc.tool.receipt.convertToExcel.useMutation({
    onSuccess: (data) => {
      if (!data.data) return;
      setReceipt(data.data);
      setReceiptId(data.data?._id?.toString() ?? null);
      utils.billing.usage.invalidate();
    },
    onError: (err) => {
      setError(err.message ?? "Something went wrong!. Please try again later.");
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

        console.log(result);
      }
    },
    [uploadTemp],
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
        <ToolDescription>
          Easily convert receipt into excel in seconds
        </ToolDescription>
      </ToolHeader>
      <ToolContent>
        <ToolInput>
          <FileDropzone
            isPending={uploadTemp.isPending}
            onFiles={handleFiles}
            buttonLabel={"Select a receipt"}
          />
          {error && <p className="text-destructive">{error}</p>}
        </ToolInput>
        <ToolAd />
        <ToolOutput>
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
        </ToolOutput>
        <ToolBenefit>
          <ToolBenefitItem
            icon={<HiOutlineShieldCheck className="size-8 text-fg-1" />}
            title="Secure & Private"
            description="Your files are processed in a secure environment and permanently deleted after conversion. We never store, share, or train on your data."
          />
          <ToolBenefitItem
            icon={<HiOutlineDocumentText className="size-8 text-fg-1" />}
            title="Supports JPG, PNG & PDF"
            description="Upload receipts in any common format — scanned documents, phone photos, or digital PDFs all convert cleanly into structured Excel rows."
          />
          <ToolBenefitItem
            icon={<HiOutlineSparkles className="size-8 text-fg-1" />}
            title="AI-Powered Accuracy"
            description="Our model reads merchant names, dates, line items, and totals with high precision — even from handwritten or low-quality receipt images."
          />
        </ToolBenefit>

        <ToolGuide>
          <ToolGuideItem
            step={1}
            title="Upload your receipt"
            description="Drag and drop a JPG, PNG, or PDF receipt into the upload area, or click to browse your files."
          />
          <ToolGuideItem
            step={2}
            title="Let AI extract the data"
            description="Our model reads merchant names, dates, line items, and totals — even from handwritten or low-quality images."
          />
          <ToolGuideItem
            step={3}
            title="Download your Excel file"
            description="Get a clean, structured spreadsheet instantly. Ready to share with your accountant or import into Xero."
          />
        </ToolGuide>
        <ToolReview reviews={REVIEW_ITEMS} />
        <ToolFaq items={FAQ_ITEMS}></ToolFaq>
      </ToolContent>
    </Tool>
  );
};
