"use client";

import React from "react";
import Loading from "../ui/loading";
// import { AppSidebar } from "@snappin/ui/components/navbar/app.sidebar";
// import { WorkspaceSettingsSidebar } from "@snappin/ui/components/navbar/workspaceSettings.sidebar";
// import { SidebarProvider } from "@snappin/ui/components/sidebar";
import AppNavbar from "./app.navbar";
// import { DivideSignSquareIcon } from "@hugeicons-pro/core-bulk-rounded";

export function DashboardLayout({
  children,
  showNavItems,
}: {
  children: React.ReactNode;
  showNavItems?: boolean;
}) {
  return (
    <div className="overflow-y-auto h-screen">
      {/* <AppSidebar /> */}
      <AppNavbar showNavItems={showNavItems} />
      <Loading />
      <main className="mt-6 max-w-5xl mx-auto">{children}</main>
      {/* <BottomFloatingNav user={data} /> */}
    </div>
  );
}
export function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen">
      <Loading />
      <AppNavbar />
      {/* <WorkspaceSettingsSidebar /> */}
      <main className="mt-10 max-w-5xl mx-auto">{children}</main>
    </div>
  );
}

export function AccountLayout({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <Loading />
      <main className="mt-8 max-w-7xl mx-auto">{children}</main>
    </>
  );
}
