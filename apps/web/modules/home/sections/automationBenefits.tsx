import React from "react";
import {
  Mail01Icon,
  ShieldKeyIcon,
  PencilEdit01Icon,
  //   LightningIcon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react";
import { Section } from "../../../components/layout/sectionLayout";
import { cn } from "@snappin/ui/lib/utils";

const benefits = [
  {
    icon: PencilEdit01Icon,
    title: "Zero manual entry",
    color: "text-fg-1",
    description:
      "Every receipt is read and structured by AI. No typing, no spreadsheets.",
  },
  {
    icon: Mail01Icon,
    title: "All sources, one place",
    color: "text-fg-1",
    description:
      "Email, mobile scans and uploads all flow into one Snappin dashboard.",
  },
  {
    icon: ShieldKeyIcon,
    title: "Always audit ready",
    color: "text-fg-1",
    description:
      "Receipts are categorised and stored securely so tax season is stress free.",
  },
];

const BenefitCard = ({
  title,
  description,
  icon: Icon,
  color,
}: {
  title: string;
  description: string;
  icon: IconSvgElement;
  color: string;
}) => {
  return (
    <div className="flex flex-col items-center text-center gap-3 px-4">
      <div className="rounded-full flex items-center justify-center">
        <HugeiconsIcon
          icon={Icon}
          className={cn("size-5 text-fg-2", color)}
          strokeWidth={2}
        />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-base/6 font-medium text-center text-fg-4">
          {title}
        </h3>
        <span className="text-fg-2 text-sm/5.5">{description}</span>
      </div>
    </div>
  );
};

export const AutomationBenefits = () => {
  return (
    <Section className="md:pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
        {benefits.map((b) => (
          <BenefitCard
            key={b.title}
            title={b.title}
            description={b.description}
            icon={b.icon}
            color={b.color}
          />
        ))}
      </div>
    </Section>
  );
};
