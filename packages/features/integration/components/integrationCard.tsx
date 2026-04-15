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
import { Skeleton } from "@snappin/ui/components/skeleton";

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
    <Icon icon={icon} className="size-7 flex items-center justify-center" />
  );
};

export const IntegrationCardTitle = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Lead className="text-sm! font-medium text-fg-4">{children}</Lead>
  );
};

export const IntegrationCardContent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <Small className="md:text-[0.85rem] text-fg-2 font-normal">{children}</Small>;
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
    <Card className="gap-0 shadow-xs rounded-2xl border border-bg-2 w-full p-0.5">
      <CardHeader className="border-b-0 px-4 py-2">
        <IntegrationCardHeader>
          <IntegrationCardIcon icon={icon} />
          <div className="flex flex-col justify-center gap-0.5 mt-1">
            <IntegrationCardTitle>{name}</IntegrationCardTitle>
            {status && status == "reauth_required" && (
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
            )}
            {hint && (
              <span className="text-muted-foreground text-xs">{hint}</span>
            )}
          </div>
        </IntegrationCardHeader>
      </CardHeader>

      <CardContent className="py-2 pt-1 px-3">
        <IntegrationCardContent>{description}</IntegrationCardContent>
      </CardContent>

      <CardFooter className="flex flex-col min-h-fit items-end ml-auto gap-2 py-2 pb-3 px-3">
        {isLoading ? (
          <Skeleton />
        ) : isConnected ? (
          reAuthorizationNeeded ? (
            <div className="w-full flex gap-2">
              <Button
                variant="dim"
                className="w-fit flex-1 bg-yellow-500/10 disabled:text-yellow-800 text-yellow-800 hover:text-yellow-800"
                onClick={onReAuthorization}
                disabled={isProgress}
              >
                {isProgress && <Spinner className="text-yellow-800" />}
                Reauthorize
              </Button>
            </div>
          ) : (
            <div className="w-fit mr-auto flex gap-2">
              <Button
                variant="dim"
                className="min-w-fit flex-1 bg-destructive/10 disabled:text-destructive text-destructive hover:text-destructive"
                onClick={onDisconnectClick}
                disabled={isProgress}
              >
                {isProgress && <Spinner className="text-destructive" />}
                Disconnect
              </Button>
            </div>
          )
        ) : (
          <Button
            variant="outline"
            className="w-fit mr-auto"
            onClick={onConnectClick}
            disabled={connectLoading != null}
          >
            <div className="flex items-center gap-2">
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
