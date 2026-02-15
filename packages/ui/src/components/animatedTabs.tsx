"use client";

import * as React from "react";
import { cn } from "@snappin/ui/lib/utils";
import { ReactNode } from "react";
import { TabCategory } from "@snappin/shared/dashboard";
import { Badge } from "./badge";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Button } from "./button";
import { MenuSquareIcon } from "@hugeicons-pro/core-bulk-rounded";
import { Tabs, TabsContent, } from "./tabs";

export function AnimatedTabs({
  tabs,
  value,
  changeTab,
  workspaceSwitcher,
  children,
}: {
  tabs: TabCategory[];
  value?: string;
  changeTab?: (value: string) => void;
  workspaceSwitcher?: ReactNode;
  children: ReactNode;
}) {
  const flatTabs = React.useMemo(() => tabs.flatMap((c) => c.tabs), [tabs]);

  const handleSelect = (val: string) => {
    changeTab?.(val);
  };

  /* -------------------------------------------------- */

  return (
    <div className="relative px-4 xl:px-0">
      {/* ================= MOBILE / TABLET MENU BUTTON ================= */}

      <div className="lg:hidden flex justify-between items-center">
        {workspaceSwitcher}

        {/* ================= MOBILE MENU (DIALOG) ================= */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" asChild>
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={MenuSquareIcon} />
                Menu
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="left" align="start">
            {tabs.map((category, i) => (
              <DropdownMenuGroup key={i} className="mb-6">
                <DropdownMenuLabel className="text-xs text-muted-foreground mb-2">
                  {category.title}
                </DropdownMenuLabel>

                <div className="flex flex-col gap-1">
                  {category.tabs.map((tab, j) => (
                    <DropdownMenuItem
                      key={j}
                      onClick={() => handleSelect(tab.value)}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm",
                        value === tab.value
                          ? "bg-gray-5 text-gray-12"
                          : "hover:bg-gray-4",
                      )}
                    >
                      {tab.icon && (
                        <HugeiconsIcon icon={tab.icon} className="size-5" />
                      )}

                      {tab.name}

                      {tab.badge && (
                        <Badge variant={tab.badgeVariant} className="ml-auto">
                          {tab.badge}
                        </Badge>
                      )}
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuGroup>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* ================= DESKTOP TABS ================= */}
      <Tabs value={value} onValueChange={changeTab} className="flex justify-start items-start gap-16">
        

        {flatTabs.map((tab, i) => (
          <TabsContent
            key={i}
            value={tab.value}
            className="w-full overflow-y-auto"
          >
            {children}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
