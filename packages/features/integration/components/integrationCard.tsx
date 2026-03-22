import { Icon } from "@iconify/react";
import { Button } from "@snappin/ui/components/button";
import { ExtraSmall, Lead, Small } from "@snappin/ui/components/typography";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@snappin/ui/components/card";
import { Spinner } from "@snappin/ui/assets/svg/spinner";
import React from "react";
import { AppSlug } from "@snappin/shared/apps/app.schema";
import { cn } from "@snappin/ui/lib/utils";
import { IntegrationResource } from "@snappin/shared/integration/integration.schema";
import {
  IntegrationStatus,
  statusLabel,
} from "@snappin/shared/integration/status.enum";
import { Badge } from "@snappin/ui/components/badge";

export const IntegrationCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl p-4 inline-flex flex-col justify-between border-2 border-gray-3 shadow-xs shadow-gray-3 max-w-120",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const IntegrationCardHeader = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="flex items-center gap-2.5">{children}</div>;
};

export const IntegrationCardIcon = ({ icon }: { icon: string }) => {
  return (
    <Icon icon={icon} className="size-8 flex items-center justify-center" />
  );
};

export const IntegrationCardTitle = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Lead className="text-sm font-medium text-foreground">{children}</Lead>
  );
};

export const IntegrationCardContent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <Small className="text-[0.75rem]">{children}</Small>;
};

export const IntegrationCardFooter = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="flex justify-end ml-auto mt-4">{children}</div>;
};

type IntegrationCardProps = {
  name: string;
  description: string;
  appSlug: string;
  icon: string;
  note?: string | null;
  isComingSoon?: boolean;
  isConnected?: boolean;
  isLoading?: boolean;
  hint?: string;
  onConnectClick?: () => void;
  onDisconnectClick?: () => void;
  connectLoading?: AppSlug | null;
  isProgress?: boolean;
  reAuthorizationNeeded?: boolean;
  onReAuthorization?: () => void;
  integration?: IntegrationResource | null;
};

export const Integration = ({
  name,
  description,
  icon,
  onConnectClick,
  onDisconnectClick,
  connectLoading,
  note,
  isComingSoon,
  isConnected,
  hint,
  isLoading,
  reAuthorizationNeeded,
  onReAuthorization,
  isProgress = false,
  appSlug,
  integration,
}: IntegrationCardProps) => {
  const status = integration?.status as IntegrationStatus;
  const config = status ? statusLabel[status] : null;
  return (
    <Card className="gap-0 shadow border border-border/50 p-2">
      <CardHeader className="border-b-0">
        <IntegrationCardHeader>
          <IntegrationCardIcon icon={icon} />
          <div className="flex flex-col gap-0.5">
            <IntegrationCardTitle>{name}</IntegrationCardTitle>
            <Badge
              size="sm"
              variant={config?.variant}
              appearance={config?.label ? "outline" : "ghost"}
              className={cn(
                "text-start bg-transparent border-transparent px-0 text-xs justify-start",
                !config?.label && "text-muted-foreground",
              )}
            >
              {config?.label ?? "Not Connected"}
            </Badge>
            {hint && (
              <span className="text-muted-foreground text-xs">{hint}</span>
            )}
          </div>
        </IntegrationCardHeader>
      </CardHeader>

      <CardContent className="pt-0 p-0 pb-2 px-5">
        <IntegrationCardContent>{description}</IntegrationCardContent>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 pb-2 mt-4">
        {isLoading ? (
          <div className="w-full h-9 rounded-md bg-gray-5 animate-pulse" />
        ) : isConnected ? (
          reAuthorizationNeeded ? (
            <div className="flex gap-2 w-full">
              <Button
                variant="dim"
                className="flex-1 bg-yellow-500/10 disabled:text-yellow-800 text-yellow-800 hover:text-yellow-800"
                onClick={onReAuthorization}
                disabled={isProgress}
              >
                {isProgress && <Spinner className="text-yellow-800" />}
                Reauthorize
              </Button>
            </div>
          ) : (
            <div className="flex gap-2 w-full">
              <Button
                variant="dim"
                className="flex-1 bg-destructive/10 disabled:text-destructive text-destructive hover:text-destructive"
                onClick={onDisconnectClick}
                disabled={isProgress}
              >
                {isProgress && (
                  <Spinner className="text-destructive" />
                )}
                Disconnect
              </Button>
            </div>
          )
        ) : (
          <Button
            variant="dim"
            className="w-full"
            onClick={onConnectClick}
            disabled={connectLoading != null}
          >
            <div className="flex gap-2">
              {connectLoading === appSlug && <Spinner />}
              {isComingSoon ? "I want this" : "Connect"}
            </div>
          </Button>
        )}
        {note && (
          <ExtraSmall className="text-xs opacity-70 pb-2">{note}</ExtraSmall>
        )}
      </CardFooter>
    </Card>
  );
};
