import React from "react";
import { ThemeProviders } from "@snappin/ui/components/theme";
import { AppProviders } from "../components/providers/app-providers";
import { AuthenticatedShell } from "../components/providers/authenticated-shell";

/** Minimal providers for marketing/landing routes (theme only). */
export function MarketingProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProviders>
     <AuthenticatedShell>
       <AppProviders>{children}</AppProviders>
     </AuthenticatedShell>
    </ThemeProviders>
  );
}
