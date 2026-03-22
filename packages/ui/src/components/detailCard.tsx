"use client";

import * as React from "react";
import { Card } from "@snappin/ui/components/card";
import { cn } from "@snappin/ui/lib/utils";
import { ChevronRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { truncateMiddle } from "@snappin/lib/string/truncate";
import { Spinner } from "../assets/svg/spinner";

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
      "flex flex-col items-center gap-1.5 mb-4 text-center",
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
      "w-full bg-transparent border-0 rounded-xl p-0 shadow-none gap-0",
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
    <span
      className={cn("text-sm text-muted-foreground shrink-0", labelClassName)}
    >
      {label}
    </span>
    <span className={cn("text-sm font-medium text-foreground", valueClassName)}>
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
  loading = false,
}: {
  icon?: React.ReactNode;
  label: string;
  trailing?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "destructive";
  loading?: boolean;
  disabled?: boolean;
  chevron?: boolean;
}) => (
  <div
    onClick={disabled ? undefined : onClick}
    className={cn(
      "flex! w-full gap-2 cursor-pointer items-center rounded-lg px-4 py-2.5 shadow-none transition-colors",
      variant === "default" && "bg-transparent hover:bg-accent text-foreground",
      variant === "destructive" &&
        "bg-transparent hover:bg-destructive/10 text-destructive",
      disabled && "pointer-events-none opacity-50",
      loading && "cursor-progress",
      className,
    )}
  >
    {loading ? (
      <Spinner
        className={cn(
          "size-4",
          variant === "destructive" &&
            "text-destructive",
        )}
      />
    ) : icon ? (
      <span
        className={cn(
          "flex items-center",
          variant === "destructive"
            ? "text-destructive"
            : "text-muted-foreground",
        )}
      >
        {icon}
      </span>
    ) : (
      <></>
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
        <TruncatedValue value={trailing} />
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
    className={cn("w-full overflow-hidden rounded-xl p-1 bg-card", className)}
  >
    {children}
  </div>
);
