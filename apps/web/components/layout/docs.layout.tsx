import React from "react";
import { DocsSidebar } from "../docs/docsSidebar";
import { LogoSymbol } from "@snappin/ui/components/logo";
import Link from "next/link";
import { SidebarTrigger } from "@snappin/ui/components/sidebar";
import { Button } from "@snappin/ui/components/button";

export const DocsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-sidebar">
      <DocsSidebar>
        <div className="min-h-14 bg-bg-1 flex items-center justify-between xl:hidden">
          <div className="flex items-center gap-3 py-1.5 px-4">
            <LogoSymbol />
            <span className="text-fg-1/50">/</span>
            <Link
              href={"/docs"}
              className="font-normal cursor-default bg-bg-1 border border-bg-4 p-0.75 px-1.5 text-xs rounded-md"
            >
              Docs
            </Link>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="inverse" asChild>
              <Link href={"/dashboard"}>Go to dashboard</Link>
            </Button>
            <SidebarTrigger />
          </div>
        </div>
        <div className="xl:rounded-tl-2xl xl:mt-2 bg-bg-1 border border-bg-4 max-w-full min-h-screen">
          {children}
        </div>
      </DocsSidebar>
    </div>
  );
};
