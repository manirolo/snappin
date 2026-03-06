"use client";

import * as React from "react";
import { H4, Small } from "@snappin/ui/components/typography";
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
  <div className={cn("relative flex h-full w-full overflow-hidden", className)} {...props}>
    <div className={cn("flex min-w-0 flex-1 flex-col h-screen overflow-y-auto")}>
      {children}
    </div>
    {sidePanel && (
      <aside
        className={cn(
          "sticky top-0 h-screen w-md shrink-0 overflow-y-auto border-l border-sidebar-border bg-background",
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
      "flex flex-wrap items-center border-b pb-6 justify-start gap-4 px-8 pt-4",
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
  <div className={cn("flex flex-col gap-0.5", className)} {...props}>
    {children}
  </div>
);

export const DashboardTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <H4 className={cn("text-start font-bold", className)}>{children}</H4>;

export const DashboardDescription = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <Small className={cn("max-w-2xl text-start font-medium text-muted-foreground", className)}>
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
  <div className={cn("ml-auto flex items-center gap-2", className)}>
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
  <div className={cn("mt-4 w-full px-8", className)}>{children}</div>
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