"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { AdminNavbar } from "@snappin/ui/components/navbar/dashboard.navbar";
import React from "react";

export default function AppNavbar({ showNavItems }: { showNavItems?: boolean }) {
  const { user } = useUser();
  const { signOut } = useClerk();

  const data = {
    firstName: user?.firstName,
    lastName: user?.lastName,
    fullName: user?.fullName,
    imageUrl: user?.imageUrl,
    primaryEmailAddress: user?.primaryEmailAddress,
  };
  return <AdminNavbar showNavItems={showNavItems} user={data} signOut={signOut} />;
}

export function AdminDashboardLayout({
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
      <main className="mt-6 max-w-7xl mx-auto overflow-y-auto">{children}</main>
      {/* <BottomFloatingNav user={data} /> */}
    </div>
  );
}