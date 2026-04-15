import React from "react";
import { HeroSection } from "./sections/hero";
import { Benefits } from "./sections/benefits";
import { HowTo } from "./sections/howTo";
import { BillingView } from "../billing/billing.view";
import { Cta } from "./sections/cta";
import { Faq } from "./sections/faq";

export const HomPage = () => {
  return (
    <div>
      <HeroSection />
      <Benefits />
      <HowTo />
      <BillingView />
      <Faq />
      <Cta />
    </div>
  );
};

