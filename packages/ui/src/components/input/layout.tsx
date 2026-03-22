import React from "react";
import { Label } from "../label";
import { cn } from "@snappin/ui/lib/utils";

export const InputLayout = ({
  children,
  label,
  className
}: {
  label: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex justify-between border-b border-border/40 pb-4 py-2", className)}>
      <Label>{label}</Label>
      {children}
    </div>
  );
};
