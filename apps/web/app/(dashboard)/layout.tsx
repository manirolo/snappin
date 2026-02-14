import React from "react";
import { DashboardLayout } from "../../components/navbar/dashboard.navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <DashboardLayout>{children}</DashboardLayout>
    </div>
  );
}
