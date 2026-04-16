import React from "react";
import { HeroSection } from "./sections/hero";
import { Benefits } from "./sections/benefits";
import { HowTo } from "./sections/howTo";
import { Cta } from "./sections/cta";
import { Faq } from "./sections/faq";
import { PricingSection } from "./sections/pricing";

export const HomPage = () => {
  return (
    <div>
      <HeroSection />
      <Benefits />
      <HowTo />
      <PricingSection />
      <Faq />
      <Cta />
    </div>
  );
};

