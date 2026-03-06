"use client";

import React from "react";
import Loading from "../ui/loading";
import AppNavbar from "./app.navbar";
import {
  Home01Icon,
  // MenuSquareIcon,
  // Search01Icon,
  // DocumentAttachmentIcon,
  // Mail02Icon,
  // SmartPhone01Icon,
  // Settings01Icon,
} from "@hugeicons-pro/core-solid-rounded";
import { Navbar } from "@snappin/ui/components/navbar/dashboard_old.navbar";
import { AppSidebar } from "@snappin/ui/components/navbar/dashboard.navbar";
import { SidebarProvider } from "@snappin/ui/components/sidebar";
import { ScrollArea } from "@snappin/ui/components/scroll-area";

// const nav: Navbar[] = [
//   { href: "/home", icon: Home01Icon, label: "Dashboard", type: "link" },
//   {
//     href: "/bookkeeping/documents",
//     icon: DocumentAttachmentIcon,
//     label: "Documents",
//     type: "link",
//   },
//   {
//     label: "Email Accounts",
//     icon: Mail02Icon,
//     type: "link",
//     href: "/accounts",
//   },
//   {
//     label: "Mobile Scanners",
//     icon: SmartPhone01Icon,
//     type: "link",
//     href: "/mobile-scanners",
//   },
//   {
//     href: "/retroSearch",
//     icon: Search01Icon,
//     label: "Retroactive",
//     type: "link",
//   },
//   {
//     href: "/integrations",
//     icon: MenuSquareIcon,
//     label: "Integrations",
//     type: "link",
//   },
//   { href: "/settings", icon: Settings01Icon, label: "Settings", type: "link" },
// ];

const accountNav: Navbar[] = [
  { href: "/account", icon: Home01Icon, label: "Account", type: "link" },
  { href: "/appearance", icon: Home01Icon, label: "Appearance", type: "link" },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="bg-sidebar h-screen">
      <Loading />
      <AppSidebar />
      <main className="flex flex-col w-full bg-background overflow-hidden">
        <ScrollArea className="flex-1 h-full">{children}</ScrollArea>
      </main>
    </SidebarProvider>
  );
}

export function AccountLayout({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <AppNavbar nav={accountNav} />
      <Loading />
      <main className="mt-8 max-w-7xl mx-auto">{children}</main>
    </>
  );
}
