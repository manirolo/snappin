"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { Navbar as TNavbar, DashboardNavbar as Navbar } from "@snappin/ui/components/navbar/dashboard_old.navbar";
import React from "react";

export default function AppNavbar({ showNavItems, nav }: { showNavItems?: boolean, nav: TNavbar[] }) {
  const { user } = useUser();
  const { signOut } = useClerk();

  const data = {
    firstName: user?.firstName,
    lastName: user?.lastName,
    fullName: user?.fullName,
    imageUrl: user?.imageUrl,
    primaryEmailAddress: user?.primaryEmailAddress,
  };
  return <Navbar showNavItems={showNavItems} user={data} signOut={signOut} />;
}
