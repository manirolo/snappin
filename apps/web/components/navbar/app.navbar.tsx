"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { DashboardNavbar } from "@snappin/ui/components/navbar/dashboard.navbar";
import { HomeNavbar } from "@snappin/ui/components/navbar/home.navbar";
import { useUsage } from "@snappin/features/billing/hooks/useUsage";
import React from "react";
import { Button } from "@snappin/ui/components/button";
import { PlanSlug } from "@snappin/shared/billing/plan.schema";
import { Skeleton } from "@snappin/ui/components/skeleton";
import { useRouter } from "next/navigation";
import posthog from 'posthog-js'
import { HugeiconsIcon } from "@hugeicons/react";
import { Crown02Icon } from "@hugeicons-pro/core-bulk-rounded";
import { env } from "@snappin/env";

export function AppNavbar({ showNavItems }: { showNavItems?: boolean }) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { usage, isLoading } = useUsage();
  const router = useRouter();
  const data = {
    fullName: user?.fullName,
    imageUrl: user?.imageUrl,
    primaryEmailAddress: user?.emailAddresses[0],
  };

  const handleSignOut = async () => {
    posthog.reset(); // reset PostHog BEFORE signing out
    await signOut();
  };


  return (
    <DashboardNavbar
      showNavItems={showNavItems}
      user={data}
      signOut={() => handleSignOut()}
      planId={usage?.planId as PlanSlug}
      billingButton={
        <>
          {isLoading ? (
            <Skeleton />
          ) : (
            <Button
              variant={"dim"}
              size="sm"
              className={!usage?.hasPaidPlan ? "bg-yellow-4" : ""}
              onClick={() => {
                if (usage?.hasPaidPlan) {
                  router.push("/settings");
                } else {
                  router.push(`/pricing?utm_medium=account-info&utm_source=${env.app.frontend_url}`);
                }
              }}
            >
              {usage?.hasPaidPlan ? <span>Manage subscription</span> : <div className="flex items-center gap-2"><HugeiconsIcon className="size-4" icon={Crown02Icon} />Upgrade plan</div>}
            </Button>
          )}
        </>
      }
    />
  );
}

export function LandingNavbar() {
  return <HomeNavbar />;
}
