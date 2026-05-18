import React from "react";
import { AuthenticatedShell } from "../../components/providers/authenticated-shell";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AuthenticatedShell>{children}</AuthenticatedShell>;
}

export const metadata = {
  title: "Snappin",
  description: "",
};
