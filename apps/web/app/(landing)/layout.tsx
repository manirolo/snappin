import React from "react";
import { LandingLayout } from "../../components/navbar/dashboard.navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <LandingLayout>{children}</LandingLayout>;
}
