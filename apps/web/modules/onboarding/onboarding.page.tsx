"use client";

import React from "react";
import {
  OnboardingFooter,
  OnboardingSection,
} from "./components/layout";
import {
  Stepper,
  StepperContent,
  StepperPanel,
} from "@snappin/ui/components/stepper";
import { Small } from "@snappin/ui/components/typography";
import { ConnectSource } from "./steps/_1_ConnectSource";

export const OnboardingPage = () => {
  return (
    <OnboardingSection>
      <Stepper defaultValue={1} className="w-full max-w-lg space-y-8">
        <StepperPanel>
          <StepperContent
            value={1}
            className="flex flex-col items-center justify-center"
          >
            <ConnectSource />
            <OnboardingFooter>
              <Small>Step 1 of 2</Small>
            </OnboardingFooter>
          </StepperContent>
        </StepperPanel>
      </Stepper>
    </OnboardingSection>
  );
};
