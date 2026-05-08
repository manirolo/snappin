import React from "react";
import {
  Section,
  SectionHeader,
  SectionTitle,
  SectionDescription,
  SectionContent,
  SectionLabel,
} from "../../../components/layout/sectionLayout";
import { CDNImage } from "@snappin/ui/components/imagekit/image";

const STEPS = [
  {
    number: "01",
    title: "Connect your email",
    description:
      "Link your Gmail or Outlook in one click. Snappin monitors your inbox for receipts automatically.",
  },
  {
    number: "02",
    title: "AI extracts the data",
    description:
      "Vendor, amount, date, and category — pulled from every receipt and invoice without lifting a finger.",
  },
  {
    number: "03",
    title: "Synced with Xero",
    description:
      "Expenses flow directly into Xero, ready for reconciliation. No manual entry, no copy-paste.",
  },
];

export const EmailMonitoringSetup = () => {
  return (
    <Section>
      <SectionHeader>
        <SectionLabel>How it works</SectionLabel>
        <SectionTitle>Automatically collect receipts from email</SectionTitle>
        <SectionDescription>
          Receipts keep filling inboxes, and important ones often get missed
          during expense tracking.
        </SectionDescription>
      </SectionHeader>

      <SectionContent>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-4">
          {/* Image side */}
          <div className="flex justify-center">
            <CDNImage
              src="/static/images/landing/connec_source_with_bg.png?updatedAt=1777457463810"
              imageClassName="w-full max-w-sm rounded-2xl shadow-sm"
              alt="Email source connect dialog"
            />
          </div>

          {/* Steps side */}
          <div className="flex flex-col gap-8">
            {STEPS.map((step, i) => (
              <div key={i} className="flex gap-4">
                {/* Number + connector line */}
                <div className="flex flex-col items-center">
                  <span className="text-xs font-semibold text-fg-3 tabular-nums w-7 h-7 rounded-full border border-bg-3 flex items-center justify-center shrink-0 group-hover:border-fg-2 group-hover:text-fg-1 transition-colors">
                    {step.number}
                  </span>
                  {i < STEPS.length - 1 && (
                    <span className="w-px flex-1 bg-bg-3 mt-2" />
                  )}
                </div>

                {/* Text */}
                <div className="pb-6">
                  <h3 className="text-base font-semibold text-fg-4 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-fg-2 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionContent>
    </Section>
  );
};
