"use client";

import * as React from "react";
import { Small } from "@snappin/ui/components/typography";
import { cn } from "@snappin/ui/lib/utils";

export const Dashboard = ({
  children,
  sidePanel,
  sidePanelClassName,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  sidePanel?: React.ReactNode;
  sidePanelClassName?: string;
}) => (
  <div className={cn("relative flex h-full w-full", className)} {...props}>
    <div className={cn("flex min-w-0 max-w-4xl mx-auto flex-1 flex-col overflow-y-auto")}>
      {children}
    </div>
    {sidePanel && (
      <aside
        className={cn(
          "sticky top-0 w-md shrink-0 overflow-y-auto border-l border-sidebar-border bg-background",
          sidePanelClassName,
        )}
      >
        {sidePanel}
      </aside>
    )}
  </div>
);

export const DashboardHeader = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-wrap items-center pb-6 justify-center gap-4 pt-4 px-4 xl:px-2",
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

export const DashboardHeaderMain = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col items-start gap-1.5", className)} {...props}>
    {children}
  </div>
);

export const DashboardTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <h6 className={cn("text-xl text-start font-medium", className)}>{children}</h6>;

export const DashboardDescription = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <Small className={cn("max-w-2xl text-center font-normal text-muted-foreground", className)}>
    {children}
  </Small>
);

export const DashboardActions = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("md:ml-auto flex items-center gap-2", className)}>
    {children}
  </div>
);

export const DashboardContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("mt-4 w-full px-4 pb-4 sm:w-full xl:px-0", className)}>{children}</div>
);

export const DashboardDetailPanel = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {

  return (
    <div className={cn("flex h-full w-full flex-col p-6", className)}>
      {children}
    </div>
  );
};