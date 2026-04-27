"use client";

import React from "react";
import { Button } from "@snappin/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@snappin/ui/components/card";
import { Tabs, TabsList, TabsTrigger } from "@snappin/ui/components/tabs";
import { trpc } from "@snappin/features/trpc/react/client";
import { Spinner } from "@snappin/ui/assets/svg/spinner";
import { Icon } from "@iconify/react";
import {
  PRICING_CONFIG,
  BillingCycle,
  PlanId,
} from "@snappin/features/billing/lib/pricing";
import {
  Section,
  SectionDescription,
  SectionHeader,
  SectionContent,
  SectionTitle,
  SectionLabel,
} from "../../../components/layout/sectionLayout";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { PlanInterval } from "@snappin/shared/billing/plan.schema";
import { CurlyArrow } from "@snappin/ui/assets/svg/arrow";
import { motion } from "framer-motion";
import { cn } from "@snappin/ui/lib/utils";

export const PricingSection = () => {
  const [billingCycle, setBillingCycle] =
    React.useState<BillingCycle>("monthly");
  const [checkoutPlanId, setCheckoutPlanId] = React.useState<PlanId | null>(
    null,
  );
  const [error, setError] = React.useState<string | null>(null);

  const createCheckout = trpc.billing.createCheckout.useMutation({
    onError: (err) => {
      setError(err.message ?? "Failed to create checkout session");
    },
  });

  const { isSignedIn } = useAuth();
  const router = useRouter();

  const handleCheckout = async (planId: PlanId) => {
    if (!isSignedIn) {
      router.push("/signup?redirect_url=/pricing");
      return;
    }

    setCheckoutPlanId(planId);

    try {
      const result = await createCheckout.mutateAsync({
        pricingSlug: planId,
        frequency: billingCycle as PlanInterval,
      });

      if (result.url) window.location.href = result.url;
    } catch {
      setCheckoutPlanId(null);
    }
  };

  return (
    <div>
      <Section>
        <SectionHeader>
          <SectionLabel>Pricing</SectionLabel>
          <SectionTitle>Plan that grows with you</SectionTitle>
          <SectionDescription>
            Start for free. No credit card required. Upgrade when you&#39;re
            ready
          </SectionDescription>
        </SectionHeader>

        <SectionContent>
          <div className="max-w-7xl mx-auto mb-12 space-y-8">
            <Tabs
              value={billingCycle}
              onValueChange={(v) => setBillingCycle(v as BillingCycle)}
              className="w-full"
            >
              <div className="relative my-18 mt-0 flex items-center justify-center">
                {/* Custom animated tab switcher — replaces default TabsList highlight */}
                <TabsList className="bg-bg-3 border-0 rounded-[22px] w-fit flex relative p-1">
                  {/* Sliding background pill */}
                  <motion.div
                    className="absolute top-1 bottom-1 rounded-[22px] bg-card shadow-sm"
                    animate={{
                      left: billingCycle === "monthly" ? "4px" : "calc(50%)",
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    style={{ width: "calc(50% - 4px)" }}
                  />

                  <TabsTrigger
                    value="monthly"
                    className="relative z-10 rounded-[22px] py-2.5 md:min-w-20 
    data-[state=active]:bg-transparent data-[state=active]:shadow-none 
    data-[state=active]:text-fg-4 transition-colors duration-200"
                  >
                    Monthly
                  </TabsTrigger>
                  <TabsTrigger
                    value="yearly"
                    className="relative z-10 rounded-[22px] py-2.5 md:min-w-20 
    data-[state=active]:bg-transparent data-[state=active]:shadow-none
    data-[state=active]:text-fg-4 transition-colors duration-200"
                  >
                    Yearly
                  </TabsTrigger>
                </TabsList>

                <span
                  className="absolute flex items-center gap-2 font-fuzzy-bubbles! text-sm text-zinc-500 font-normal"
                  style={{
                    left: "calc(50% + 70px)",
                    top: "-40%",
                    transform: "translateY(-50%)",
                  }}
                >
                  <CurlyArrow className="text-zinc-500 -rotate-40 mt-4" />2
                  months free
                </span>
              </div>
            </Tabs>

            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {PRICING_CONFIG.plans
                .filter((p) => p.displayOnSite === true)
                .map((plan) => {
                  const pricing = plan.pricing[billingCycle];
                  const isLoading =
                    checkoutPlanId === plan.id && createCheckout.isPending;
                  const displayPrice = pricing.original;

                  return (
                    <Card
                      key={plan.id}
                      className={`rounded-2xl flex flex-col border border-bg-2 shadow-none bg-transparent ${plan.id == "scale" && "bg-linear-to-b from-green-a2 ring-2 ring-green-a2 border-green-a2 to-green-1"} bg-card`}
                    >
                      <CardHeader className="text-center relative pb-0">
                        <CardTitle className="font-medium">
                          {plan.label}
                        </CardTitle>

                        <CardDescription className="text-fg-2 my-2 text-balance">
                          Upto {plan.docsLabel[billingCycle]}{" "}
                          {billingCycle === "yearly" ? "annual" : "monthly"}{" "}
                          receipts extracted
                        </CardDescription>

                        <div className="text-start flex items-end gap-2 py-4">
                          <span className="text-4xl font-bold leading-none">
                            ${displayPrice}
                          </span>
                          <div className="flex text-fg-2 gap-1 text-sm leading-tight mb-0.5">
                            <span>per</span>{" "}
                            <span>
                              {billingCycle === "yearly" ? "year" : "month"}
                            </span>
                          </div>
                        </div>

                        <div className="w-full text-center">
                          <Button
                            className="w-full capitalize shadow-none my-2 text-fg-4"
                            size="xl"
                            radius="full"
                            variant={plan.id == "scale" ? "primary" : "outline"}
                            disabled={createCheckout.isPending}
                            onClick={() => handleCheckout(plan.id)}
                          >
                            {isLoading ? (
                              <Spinner
                                className={cn(
                                  plan.id == "scale" ? "text-white" : "",
                                )}
                              />
                            ) : (
                              `Get Started`
                            )}
                          </Button>

                          {error && (
                            <span className="text-sm font-normal leading-relaxed text-destructive">
                              {error}
                            </span>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="flex-1 space-y-4 text-sm">
                        <div className="text-fg-2 mb-4">This includes: </div>
                        <ul className="space-y-4">
                          {plan.features[billingCycle]?.map((feat, i) => (
                            <li
                              key={i}
                              className={cn(
                                "flex gap-2 text-fg-3 text-sm items-center leading-relaxed",
                                // plan.id == "scale" && "text-white/70",
                              )}
                            >
                              <Icon
                                icon="mdi:check-circle"
                                className="size-4 text-fg-a1 shrink-0 mt-0.5"
                              />
                              {feat}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter></CardFooter>
                    </Card>
                  );
                })}
            </div>
          </div>
        </SectionContent>
      </Section>
    </div>
  );
};
