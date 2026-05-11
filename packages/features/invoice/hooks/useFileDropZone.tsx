"use client";

import { useRef, useState, useCallback } from "react";
import toast from "react-hot-toast";

const DEFAULT_ACCEPT = ["application/pdf", "image/png", "image/jpeg"];

export function useFileDropzone({
  onFiles,
  accept = DEFAULT_ACCEPT,
  disabled = false,
  onBeforeOpen,
}: {
  onFiles: (files: File[]) => void;
  accept?: string[];
  disabled?: boolean;
  onBeforeOpen?: () => boolean | Promise<boolean>;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: File[]) => {
      const valid = files.filter((f) => accept.includes(f.type));
      if (!valid.length) {
        toast.error("Only PDF, PNG, or JPG files are accepted");
        return;
      }
      onFiles(valid);
    },
    [onFiles, accept],
  );

  const runGuard = useCallback(async (): Promise<boolean> => {
    if (!onBeforeOpen) return true;
    const allowed = await onBeforeOpen();
    return allowed;
  }, [onBeforeOpen]);

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

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const allowed = await runGuard();
    if (!allowed) return;
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const openFilePicker = async () => {
    if (disabled) return;
    const allowed = await runGuard(); // ← guard on click
    if (!allowed) return;
    inputRef.current?.click();
  };

  return {
    isDragging,
    inputRef,
    openFilePicker,
    dropzoneProps: {
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
      onClick: openFilePicker,
    },
    inputProps: {
      ref: inputRef,
      type: "file" as const,
      accept: ".pdf,.png,.jpg,.jpeg",
      multiple: false,
      className: "sr-only",
      onChange: handleInputChange,
    },
  };
}
