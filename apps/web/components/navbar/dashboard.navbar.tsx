"use client";

import React from "react";
import Loading from "../ui/loading";
import AppNavbar from "./app.navbar";
import { useUser } from "@clerk/nextjs";

export function DashboardLayout({
  children,
  showNavItems,
}: {
  children: React.ReactNode;
  showNavItems?: boolean;
}) {
  const { user } = useUser();
  const data = {
    firstName: user?.firstName,
    lastName: user?.lastName,
    fullName: user?.fullName,
    imageUrl: user?.imageUrl,
    primaryEmailAddress: user?.primaryEmailAddress,
  };
  return (
    <>
      <AppNavbar showNavItems={showNavItems} />
      <Loading />
      <main className="mt-10 max-w-4xl mx-auto">{children}</main>
      {/* <BottomFloatingNav user={data} /> */}
    </>
  );
}
