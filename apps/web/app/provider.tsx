import React from "react";
import { ThemeProviders } from "@snappin/ui/components/theme";
import { TRPCProviders } from "../trpc/react/provider";

/** Minimal providers for marketing/landing routes (theme only). */
export function MarketingProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProviders>
      <TRPCProviders>{children}</TRPCProviders>
    </ThemeProviders>
  );
}
