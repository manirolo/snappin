import React from "react";
import { ToolsProviders } from "../../../components/providers/tools-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ToolsProviders>{children}</ToolsProviders>;
}
