import React from "react";
import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  SectionContent,
  SectionLabel,
} from "../../../components/layout/sectionLayout";
import { CurlyArrow3 } from "@snappin/ui/assets/svg/arrow";

const STEPS = [
  {
    emoji: "🧳",
    label: "Traveler collects receipts",
  },
  {
    emoji: "😰",
    label: "Receipts get lost, or forgotten",
  },
  {
    emoji: "❌",
    label: "Reimbursement denied",
  },
];

export const Problem = () => {
  return (
    <Section setFullScreen>
      <SectionHeader>
        <SectionLabel>Problem</SectionLabel>
        <SectionTitle>Business trips create receipt chaos</SectionTitle>
        <SectionDescription>
          After every trip, travelers return with dozens of paper receipts from
          hotels, taxis, meals, and flights. Some are lost, faded, or forgotten.
          Finance teams keep asking for missing proofs, and reimbursements get
          delayed.
        </SectionDescription>
      </SectionHeader>

      <SectionContent>
        <div className="flex flex-col sm:flex-row items-center justify-center max-w-3xl mx-auto w-full gap-2 mt-8">
          {STEPS.map((step, i) => (
            <React.Fragment key={i}>
              {/* Step */}
              <div className="flex flex-col items-center group text-center gap-6 flex-1">
                <span className="text-4xl group-hover:rotate-10 group-hover:scale-110 transition-all duration-300">
                  {step.emoji}
                </span>
                <p className="text-sm text-fg-2 leading-snug max-w-35">
                  {step.label}
                </p>
              </div>

              {/* Arrow — alternates: first curves down, second curves up */}
              {i < STEPS.length - 1 && (
                <CurlyArrow3
                  className={[
                    "size-10 text-fg-3 shrink-0",
                    // Mobile: point downward for vertical stack
                    "rotate-0",
                    // Desktop: lay flat, alternate vertical flip per arrow
                    i % 2 === 0
                      ? "sm:-rotate-90 sm:scale-y-100" // first arrow curves down
                      : "sm:rotate-90 sm:-scale-y-100", // second arrow curves up
                  ].join(" ")}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </SectionContent>
    </Section>
  );
};
