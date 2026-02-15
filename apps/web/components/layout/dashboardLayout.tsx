"use client";

import * as React from "react";
import { H4, Small } from "@snappin/ui/components/typography";

type DashboardContextValue = {
  scope: "dashboard";
};

const DashboardContext = React.createContext<DashboardContextValue | null>(
  null,
);

function useDashboard() {
  const context = React.useContext(DashboardContext);
  if (!context) {
    throw new Error("Dashboard components must be used within <Dashboard />");
  }
  return context;
}

export const Dashboard = ({ children }: { children: React.ReactNode }) => {
  return (
    <DashboardContext.Provider value={{ scope: "dashboard" }}>
      <div className="px-4 xl:px-0">{children}</div>
    </DashboardContext.Provider>
  );
};

export const DashboardHeader = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useDashboard();

  return (
    <div className="flex my-2 items-start justify-between gap-4">
      {children}
    </div>
  );
};

export const DashboardHeaderMain = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return <div {...props}>{children}</div>;
};

export const DashboardTitle = ({ children }: { children: React.ReactNode }) => {
  useDashboard();

  return <H4>{children}</H4>;
};

export const DashboardDescription = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useDashboard();

  return (
    <Small className="text-muted-foreground mt-1 max-w-2xl">{children}</Small>
  );
};

export const DashboardActions = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useDashboard();

  return <div className="ml-auto flex items-center gap-2">{children}</div>;
};

export const DashboardContent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useDashboard();

  return <div className="mt-5 w-full">{children}</div>;
};
