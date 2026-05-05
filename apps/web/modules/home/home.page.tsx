import React from "react";
import { HeroSection } from "./sections/hero";
// import { Benefits } from "./sections/benefits";
import { HowTo } from "./sections/howTo";
import { Cta } from "./sections/cta";
import { WhyUs } from "./sections/whyus";
// import { Faq } from "./sections/faq";
// import { PricingSection } from "./sections/pricing";
// import { AutomationBenefits } from "./sections/automationBenefits";

export const HomPage = () => {
  return (
    <div>
      <HeroSection />
      {/* <Benefits /> */}
      <WhyUs />
      <HowTo />
      {/* <AutomationBenefits /> */}
      {/* <PricingSection /> */}
      {/* <Faq /> */}
      <Cta />
    </div>
  );
};

