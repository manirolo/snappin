import React from "react";
import { ThemeProviders } from "@snappin/ui/components/theme";

/** Minimal providers for marketing/landing routes (theme only). */
export function MarketingProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThemeProviders>{children}</ThemeProviders>;
}
