import React from "react";
import { StatsCard, StatsTitle, StatsValue } from "./statsCard";
import { useInvoices } from "@snappin/features/invoices/hooks/useInvoices";

export const OverviewHome = () => {
  const { total } = useInvoices();

  return (
    <div className="space-y-3 w-full">
      <div className="w-full flex gap-x-4 overflow-hidden">
        <StatsCard>
          <StatsTitle>Invoices</StatsTitle>
          <StatsValue>{total}</StatsValue>
        </StatsCard>
        <StatsCard>
          <StatsTitle>Excluded</StatsTitle>
          <StatsValue>-</StatsValue>
        </StatsCard>
      </div>
    </div>
  );
};
