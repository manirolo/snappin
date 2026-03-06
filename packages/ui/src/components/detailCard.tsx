"use client";

import * as React from "react";
import { Card } from "@snappin/ui/components/card";
import { cn } from "@snappin/ui/lib/utils";
import { ChevronRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { truncateMiddle } from "@snappin/lib/string/truncate"

export const DetailCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn("flex w-full flex-col items-center gap-4 pb-4", className)}
  >
    {children}
  </div>
);

export const DetailCardLogo = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "flex size-16 items-center justify-center overflow-hidden rounded-2xl",
      className,
    )}
  >
    {children}
  </div>
);

export const DetailCardHeader = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "flex flex-col items-start gap-1.5 mb-4 text-start",
      className,
    )}
  >
    {children}
  </div>
);

export const DetailCardDescription = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>
);

export const DetailCardAmount = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <p
    className={cn(
      "text-3xl mt-4 font-semibold tracking-tight text-foreground",
      className,
    )}
  >
    {children}
  </p>
);

export const DetailCardSection = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <Card
    className={cn(
      "w-full divide-y divide-border rounded-xl border border-border p-0 shadow-none gap-0",
      className,
    )}
  >
    {children}
  </Card>
);

const TruncatedValue = ({ value }: { value: React.ReactNode }) => {
  if (typeof value !== "string") return <>{value}</>;

  const truncated = truncateMiddle(value);
  const isTruncated = truncated !== value;

  if (!isTruncated) return <>{value}</>;

  return (
    <Tooltip>
      <TooltipTrigger>{truncated}</TooltipTrigger>
      <TooltipContent>{value}</TooltipContent>
    </Tooltip>
  );
};

export const DetailRow = ({
  label,
  value,
  labelClassName,
  valueClassName,
  className,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  labelClassName?: string;
  valueClassName?: string;
  className?: string;
}) => (
  <div
    className={cn(
      "flex items-center justify-between gap-4 px-4 py-3",
      className,
    )}
  >
    <span className={cn("text-sm text-muted-foreground shrink-0", labelClassName)}>
      {label}
    </span>
    <span
      className={cn(
        "text-sm font-medium text-foreground",
        valueClassName,
      )}
    >
      <TruncatedValue value={value} />
    </span>
  </div>
);

export const DetailCardFooter = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex w-full flex-col gap-2", className)}>{children}</div>
);

export const DetailCardAction = ({
  icon,
  label,
  trailing,
  onClick,
  className,
  variant = "default",
  disabled = false,
  chevron = true,
}: {
  icon?: React.ReactNode;
  label: string;
  trailing?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "destructive";
  disabled?: boolean;
  chevron?: boolean;
}) => (
  <div
    onClick={disabled ? undefined : onClick}
    className={cn(
      "flex! w-full cursor-pointer items-center gap-2 rounded-xl px-4 py-1 shadow-none transition-colors",
      variant === "default" && "bg-accent hover:bg-muted text-foreground",
      variant === "destructive" &&
        "bg-accent hover:bg-destructive/10 text-destructive",
      disabled && "pointer-events-none opacity-50",
      className,
    )}
  >
    {icon && (
      <span
        className={cn(
          "flex size-8 shrink-0 items-center",
          variant === "destructive"
            ? "text-destructive"
            : "text-muted-foreground",
        )}
      >
        {icon}
      </span>
    )}
    <span
      className={cn(
        "flex-1 text-sm font-medium",
        variant === "destructive" ? "text-destructive" : "text-foreground",
      )}
    >
      {label}
    </span>
    {(trailing || chevron) && (
      <span
        className={cn(
          "flex items-center gap-1 text-sm",
          variant === "destructive"
            ? "text-destructive/70"
            : "text-muted-foreground",
        )}
      >
        {trailing}
        {chevron && <ChevronRight size={14} />}
      </span>
    )}
  </div>
);

export const DetailCardActionGroup = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "w-full overflow-hidden rounded-2xl p-1 bg-accent",
      className,
    )}
  >
    {children}
  </div>
);
