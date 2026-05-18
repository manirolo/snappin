import React from "react";
import { GuestNavbar } from "../../components/navbar/guest.navbar";
import { AuthenticatedShell } from "../../components/providers/authenticated-shell";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthenticatedShell>
      <GuestNavbar>{children}</GuestNavbar>
    </AuthenticatedShell>
  );
}
