import React from "react";
import { SettingsLayout } from "../../components/navbar/dashboard.navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <SettingsLayout>{children}</SettingsLayout>
    </div>
  );
}
