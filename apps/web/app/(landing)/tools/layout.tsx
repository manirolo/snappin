import React from "react";
import { TRPCProviders } from "../../../trpc/react/provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <TRPCProviders>{children}</TRPCProviders>;
}
