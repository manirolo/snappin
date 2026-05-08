"use client";

import React from "react";
import Loading from "../ui/loading";
// import { AppSidebar } from "@snappin/ui/components/navbar/app.sidebar";
// import { WorkspaceSettingsSidebar } from "@snappin/ui/components/navbar/workspaceSettings.sidebar";
// import { SidebarProvider } from "@snappin/ui/components/sidebar";
import { AppNavbar, LandingNavbar } from "./app.navbar";
// import Lenis from "lenis";
// import { DivideSignSquareIcon } from "@hugeicons-pro/core-bulk-rounded";
import { HomeFooter } from "../../components/footer/home.footer";

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
      <main className="mt-6 max-w-7xl mx-auto overflow-y-auto">{children}</main>
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
      <main className="mt-10 max-w-3xl mx-auto">{children}</main>
    </div>
  );
}

export function AccountLayout({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <AppNavbar showNavItems={false} />
      <Loading />
      <main className="mt-6 max-w-7xl mx-auto">{children}</main>
    </>
  );
}

export function LandingLayout({ children }: { children?: React.ReactNode }) {
  // useEffect(() => {
  //   const lenis = new Lenis({
  //     autoRaf: true,
  //   });

  //   function raf(time: number) {
  //     lenis.raf(time);
  //     requestAnimationFrame(raf);
  //   }

  //   requestAnimationFrame(raf);

  //   return () => lenis.destroy();
  // }, []);
  return (
    <div className="h-full min-h-screen">
      <LandingNavbar />
      <main className="py-10">{children}</main>
      <HomeFooter />
    </div>
  );
}
