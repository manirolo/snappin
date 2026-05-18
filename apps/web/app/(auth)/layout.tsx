import React from "react";
import { AuthenticatedShell } from "../../components/providers/authenticated-shell";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthenticatedShell>
      <div className="min-h-screen">{children}</div>
    </AuthenticatedShell>
  );
}
