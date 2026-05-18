import React from "react";
import { DashboardLayout } from "../../components/navbar/dashboard.navbar";
import { AuthenticatedShell } from "../../components/providers/authenticated-shell";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthenticatedShell>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthenticatedShell>
  );
}
