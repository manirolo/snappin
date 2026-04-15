import React from "react";
import { Button } from "@snappin/ui/components/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogLabel,
  DialogFooter,
} from "@snappin/ui/components/dialog";
import { Skeleton } from "@snappin/ui/components/skeleton";
import Link from "next/link";
import { env } from "@snappin/env";
import { HugeiconsIcon } from "@hugeicons/react";
import { SparklesIcon } from "@hugeicons-pro/core-solid-rounded";

type UpgradeButtonProps = {
  popupId?: string;
  description?: string;
  isLoading?: boolean;
  limitReached?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
};

export const UpgradeButton = ({
  popupId,
  description,
  isLoading = false,
  limitReached = false,
  onClick,
  children,
}: UpgradeButtonProps) => {
  if (isLoading) {
    return <Skeleton className="h-8 w-24 rounded-lg" />;
  }

  if (limitReached) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="max-w-360">
          <DialogHeader>
            <DialogLabel>Upgrade</DialogLabel>
            <DialogTitle>You've reached the limit!</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="py-4" />
          <DialogFooter>
            <Button variant="warning" size="lg" className="mx-auto" asChild>
              <Link
                className="leading-0"
                href={`/pricing?utm_medium=${popupId ?? "default-dialog"}&utm_source=${env.app.frontend_url}`}
              >
                <HugeiconsIcon icon={SparklesIcon} /> Upgrade now
              </Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return <span onClick={onClick}>{children}</span>;
};
