"use client";

import { cn } from "@snappin/ui/lib/utils";
import { useFileDropzone } from "../hooks/useFileDropZone";
import { Button } from "@snappin/ui/components/button";
import { useUser } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";

export const FileDropzone = ({
  onFiles,
  isPending = false,
  accept,
  className,
  buttonLabel,
}: {
  onFiles: (files: File[]) => void;
  isPending?: boolean;
  accept?: string[];
  className?: string;
  buttonLabel?: string;
}) => {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const { isDragging, inputProps, dropzoneProps } = useFileDropzone({
    onFiles,
    accept,
    disabled: isPending,
    onBeforeOpen: () => {
      if (!user) {
        router.push(`/signup?redirect_url=${pathname}`); // ← dynamic redirect
        return false;
      }
      return true;
    },
  });

  return (
    <>
      <label className="opacity-0">{buttonLabel}</label>
      <input {...inputProps} />
      <div
        {...dropzoneProps}
        className={cn(
          "flex flex-col h-[30vh] w-full items-center justify-center gap-4",
          "rounded-2xl border-2 border-dashed border-transparent p-10 text-center",
          "transition-colors bg-gray-a1/90 duration-200 cursor-pointer",
          isDragging
            ? "border-primary bg-primary/5"
            : "hover:border-green-a3 hover:bg-green-a1",
          isPending && "pointer-events-none opacity-60",
          className,
        )}
      >
        {isPending ? (
          <div className="flex flex-col items-center gap-6 w-full">
            <div className="relative w-full h-2 max-w-sm rounded-sm mx-auto bg-muted overflow-hidden">
              <div className="absolute inset-y-0 bg-green-500 animate-progress" />
            </div>
            <p className="text-sm text-fg-3">AI processing... hang on</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <Button disabled={isDragging} size="xl">
              {buttonLabel}
            </Button>
            <p className="font-normal text-fg-3 text-sm">
              {isDragging && "Drop file here"}
            </p>
          </div>
        )}
      </div>
    </>
  );
};
