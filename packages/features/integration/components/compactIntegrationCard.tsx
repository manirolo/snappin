"use client"

import { Icon } from "@iconify/react";
import { DotSpinner } from "@snappin/ui/assets/svg/dotSpinner";
import { Small } from "@snappin/ui/components/typography";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@snappin/ui/components/tooltip";
import { cn } from "@snappin/ui/lib/utils";
import React, { createContext, useContext } from "react";

interface CompactIntegrationContextValue {
  loading?: boolean;
}

const CompactIntegrationContext =
  createContext<CompactIntegrationContextValue | null>(null);

const useCompactIntegration = () => {
  const context = useContext(CompactIntegrationContext);
  if (!context) {
    throw new Error(
      "CompactIntegration components must be used within CompactIntegrationCard",
    );
  }
  return context;
};

export interface CompactIntegrationCardProps extends React.ComponentPropsWithoutRef<"div"> {
  loading?: boolean;
  tooltip?: string;
}

export const CompactIntegrationCard = ({
  children,
  className,
  loading,
  tooltip,
  ...props
}: CompactIntegrationCardProps) => {
  return (
    <CompactIntegrationContext.Provider value={{ loading }}>
      {tooltip ? (
        <Tooltip>
          <TooltipTrigger>
            <div
              className={cn(
                "group shrink-0 rounded-xl shadow-none p-6 cursor-pointer transition-all duration-300 hover:bg-gray-3",
                loading && "pointer-events-none cursor-not-allowed opacity-70",
                className,
              )}
              {...props}
            >
              <div className="flex flex-col items-center justify-center h-full gap-3 p-2">
                {children}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
      ) : (
        <div
          className={cn(
            "group shrink-0 rounded-xl shadow-sm p-6 cursor-pointer transition-all duration-300 hover:bg-gray-3",
            loading && "pointer-events-none cursor-not-allowed opacity-70",
            className,
          )}
          {...props}
        >
          <div className="flex flex-col items-center justify-center h-full gap-3 p-2">
            {children}
          </div>
        </div>
      )}
    </CompactIntegrationContext.Provider>
  );
};

export const CompactIntegrationIcon = ({ icon }: { icon: string }) => {
  return (
    <Icon icon={icon} className="size-6 transition-transform duration-300" />
  );
};

export const CompactIntegrationName = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { loading } = useCompactIntegration();

  if (loading) {
    return <DotSpinner className="size-5" />;
  }

  return <Small className="text-foreground font-onest">{children}</Small>;
};
