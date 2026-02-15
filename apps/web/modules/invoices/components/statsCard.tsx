import { Card, CardContent } from "@snappin/ui/components/card";
import { Paragraph } from "@snappin/ui/components/typography";
import React from "react";

export const StatsCard = ({ children }: { children: React.ReactNode }) => {
  return (
    <Card className="min-w-30 border-0 hover:bg-gray-2 cursor-pointer rounded-xl">
      <CardContent className="p-3">{children}</CardContent>
    </Card>
  );
};

export const StatsTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <Paragraph className="text-secondary-foreground font-dm-sans text-sm">
      {children}
    </Paragraph>
  );
};

export const StatsValue = ({ children }: { children: React.ReactNode }) => {
  return (
    <Paragraph className="text-lg font-bold font-dm-sans mt-2">
      {children}
    </Paragraph>
  );
};
