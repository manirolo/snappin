import React, { ReactNode } from "react";
import { DashboardLayout } from "../../components/navbar/dashboard.navbar";

export default function Layout({ children }: { children: ReactNode }) {
  return <DashboardLayout showNavItems={false}>{children}</DashboardLayout>;
}
