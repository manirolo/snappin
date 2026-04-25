import React from "react";
import {
  Mail01Icon,
  ShieldKeyIcon,
  Invoice03Icon,
  //   LightningIcon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react";
import { Section } from "../../../components/layout/sectionLayout";

const benefits = [
  {
    icon: ShieldKeyIcon,
    title: "GDPR compliant",
    description:
      "We pseudonymize data by default, ensuring total privacy and compliance with GDPR.",
  },
  {
    icon: Mail01Icon,
    title: "Connect your email",
    description:
      "Link Gmail or Outlook and we automatically pull receipts straight from your inbox.",
  },
  {
    icon: Invoice03Icon,
    title: "Auto-extracted receipts",
    description:
      "Our AI reads receipts, and invoices so you never have to enter data manually.",
  },
];

const BenefitCard = ({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: IconSvgElement;
}) => {
  return (
    <div className="flex flex-col items-center text-center gap-3 px-4">
      <div className="rounded-full flex items-center justify-center">
        <HugeiconsIcon
          icon={Icon}
          className="size-6 text-fg-2"
          strokeWidth={2}
        />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-base/6 font-medium text-center text-fg-4">{title}</h3>
        <span className="text-fg-2 text-sm/5.5">{description}</span>
      </div>
    </div>
  );
};

export const Benefits = () => {
  return (
    <Section>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
        {benefits.map((b) => (
          <BenefitCard
            key={b.title}
            title={b.title}
            description={b.description}
            icon={b.icon}
          />
        ))}
      </div>
    </Section>
  );
};
