import React from "react";
import { AccountLayout } from "../../components/navbar/dashboard.navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <AccountLayout>{children}</AccountLayout>
    </div>
  );
}
