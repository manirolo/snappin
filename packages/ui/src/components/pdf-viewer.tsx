"use client";

import React from "react";
import { cn } from "../lib/utils";

type PdfViewerProps = {
  url: string;
  fileName?: string;
  className?: string;
  pdfClassName?: string;
};

export const PdfViewer = ({ url, fileName, className, pdfClassName }: PdfViewerProps) => {
  const src = `${url}#toolbar=1&navpanes=0&scrollbar=1&zoom=page-fit`;

  return (
    <div className={cn("w-full h-full", className)}>
      <iframe
        src={src}
        className={cn("w-full h-full border-none overflow-x-hidden", pdfClassName)}
        title={fileName ?? "Invoice"}
      />
    </div>
  );
};
