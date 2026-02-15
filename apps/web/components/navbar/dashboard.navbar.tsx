"use client";

import React from "react";
import Loading from "../ui/loading";
import AppNavbar from "./app.navbar";

export function DashboardLayout({
  children,
  showNavItems,
}: {
  children: React.ReactNode;
  showNavItems?: boolean;
}) {
  return (
    <>
      <AppNavbar showNavItems={showNavItems} />
      <Loading />
      <main className="mt-10 max-w-4xl mx-auto">{children}</main>
      {/* <BottomFloatingNav user={data} /> */}
    </>
  );
}
