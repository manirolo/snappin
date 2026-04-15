"use client";

import { Button } from "@snappin/ui/components/button";
import { Small } from "@snappin/ui/components/typography";
import { Spinner } from "@snappin/ui/assets/svg/spinner";
import { trpc } from "@snappin/features/trpc/react/client";
import toast from "react-hot-toast";
import { useOrganization } from "@clerk/nextjs";
import { Label } from "@snappin/ui/components/label";
import { useUsage } from "@snappin/features/billing/hooks/useUsage";
import { formatDate } from "@snappin/lib/date/formateDate";
import { env } from "@snappin/env";
import React from "react";
import { useRouter } from "next/navigation";
import { useConfirmStore } from "@snappin/ui/components/alert/fn/store";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MailRemove02Icon,
  SmartPhone01Icon,
  CrownMinusIcon,
} from "@hugeicons-pro/core-stroke-rounded";

export const PlanSettings = () => {
  const { usage } = useUsage();
  const router = useRouter();
  const { openConfirm } = useConfirmStore();
  const { membership } = useOrganization({
    memberships: { infinite: true },
  });

  const cancelSubscription = trpc.billing.cancelSubscription.useMutation({
    onSuccess: () => {
      toast.success("Subscription has been cancelled");
    },
    onError: (err) => {
      toast.error(err.message ?? "Failed to cancel subscription");
    },
  });

  const handleCancelSubscription = async () => {
    openConfirm({
      title: "Cancel subscription",
      description:
        "Cancelling will downgrade your account to the free plan. The following changes will be applied immediately:",
      content: (
        <div className="space-y-3">
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm">
              <HugeiconsIcon
                icon={MailRemove02Icon}
                className="size-4 text-muted-foreground shrink-0"
              />
              Excess email accounts will be paused
            </li>
            <li className="flex items-center gap-2 text-sm">
              <HugeiconsIcon
                icon={SmartPhone01Icon}
                className="size-4 text-muted-foreground shrink-0"
              />
              Excess mobile scanners will be paused
            </li>
            <li className="flex items-center gap-2 text-sm">
              <HugeiconsIcon
                icon={CrownMinusIcon}
                className="size-4 shrink-0"
              />
              <span>
                Paid integrations (e.g. Xero) will be{" "}
                <span className="text-destructive font-medium">
                  permanently removed
                </span>
              </span>
            </li>
          </ul>
          <p className="text-sm text-muted-foreground">
            Paused accounts can be re-enabled by upgrading your plan.
          </p>
        </div>
      ),
      confirmLabel: "Cancel subscription",
      cancelLabel: "Keep subscription",
      onConfirm: () => cancelSubscription.mutate(),
      destructive: true,
    });
  };

  return (
    <div className="w-full space-y-1 border-b border-bg-3 py-4">
      <Label>Plan</Label>
      <Small className="capitalize">
        {usage?.hasPaidPlan ? (
          <span>
            {usage?.planId} ({usage?.interval}) - Next billing:{" "}
            {formatDate("MMM_DD_YYYY", usage?.currentPeriodEnd)}
          </span>
        ) : (
          <span>{usage?.planId}</span>
        )}
      </Small>

      {membership?.role === "org:admin" && (
        <div className="flex gap-2 mt-2">
          {usage?.hasPaidPlan ? (
            <Button
              variant="link"
              className="p-0 text-start justify-start text-destructive/50 hover:text-destructive"
              disabled={cancelSubscription.isPending}
              onClick={handleCancelSubscription}
            >
              {cancelSubscription.isPending && (
                <Spinner className="size-3 mr-1" />
              )}
              Cancel subscription
            </Button>
          ) : (
            <Button
              variant="link"
              className="p-0 text-start justify-start"
              onClick={() =>
                router.push(
                  `/pricing?utm_medium=settings&utm_source=${env.app.frontend_url}`,
                )
              }
            >
              Upgrade plan
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
