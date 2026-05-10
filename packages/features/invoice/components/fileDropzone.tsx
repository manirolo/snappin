"use client";

import { cn } from "@snappin/ui/lib/utils";
import { useFileDropzone } from "../hooks/useFileDropZone";
import { Button } from "@snappin/ui/components/button";

export const FileDropzone = ({
  onFiles,
  isPending = false,
  accept,
  className,
}: {
  onFiles: (files: File[]) => void;
  isPending?: boolean;
  accept?: string[];
  className?: string;
}) => {
  const { isDragging, inputProps, dropzoneProps } = useFileDropzone({
    onFiles,
    accept,
    disabled: isPending,
  });

  return (
    <>
      <input {...inputProps} />
      <div
        {...dropzoneProps}
        className={cn(
          "flex flex-col w-full items-center justify-center gap-4",
          "rounded-2xl p-10 text-center",
          "transition-colors duration-200 cursor-pointer",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-blue-300 hover:bg-muted/10",
          isPending && "pointer-events-none opacity-60",
          className,
        )}
      >
        {isPending ? (
          <div className="flex flex-col items-center gap-5 w-full">
            <div className="relative w-full h-1 max-w-sm mx-auto bg-muted overflow-hidden">
              <div className="absolute inset-y-0 bg-blue-500 animate-progress" />
            </div>
            <p className="text-xs text-fg-3">AI Processing... hang on</p>
          </div>
        ) : (
          <div className="space-y-4">
            <Button disabled={isDragging} variant="dim" size="_2xl">
              Select a receipt
            </Button>
            <p className="font-normal text-fg-3 text-sm">
              {isDragging && "Drop files here" }
            </p>
          </div>
        )}
      </div>
    </>
  );
};
