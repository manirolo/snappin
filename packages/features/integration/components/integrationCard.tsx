import { Icon } from "@iconify/react";
import { Lead, Small } from "@snappin/ui/components/typography";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@snappin/ui/components/card";
import React from "react";
import { cn } from "@snappin/ui/lib/utils";

export const IntegrationCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <Card
      className={cn(
        "gap-0 shadow-xs rounded-2xl border border-bg-2 w-full",
        className,
      )}
    >
      {children}
    </Card>
  );
};

export const IntegrationCardHeader = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <CardHeader className="flex-row justify-start items-center p-4 gap-2.5">
      {children}
    </CardHeader>
  );
};

export const IntegrationCardIcon = ({ icon }: { icon: string }) => {
  return (
    <Icon icon={icon} className="size-7 flex items-center justify-center" />
  );
};

export const IntegrationCardHeaderMain = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col items-start justify-center gap-px">
      {children}
    </div>
  );
};

export const IntegrationCardTitle = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <Lead className="text-sm! font-medium text-fg-4">{children}</Lead>;
};

export const IntegrationCardContent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <CardContent className="px-4 py-2.5 pt-1">
      <Small className="md:text-[0.85rem] text-fg-2 font-normal">
        {children}
      </Small>
    </CardContent>
  );
};

export const IntegrationCardFooter = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <CardFooter className={cn("flex justify-end ml-auto p-2.5", className)}>
      {children}
    </CardFooter>
  );
};
