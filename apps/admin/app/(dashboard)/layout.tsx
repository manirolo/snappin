import { AdminDashboardLayout } from "@/components/navbar/admin.navbar";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
}
