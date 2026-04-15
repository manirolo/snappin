import React from "react";
import { Paragraph } from "@snappin/ui/components/typography";
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
      "Link Gmail or Outlook and we automatically pull invoices straight from your inbox.",
  },
  {
    icon: Invoice03Icon,
    title: "Auto-extracted invoices",
    description:
      "Our AI reads receipts, bills and invoices so you never have to enter data manually.",
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
      <div className="size-10 rounded-full bg-green-a1 flex items-center justify-center">
        <HugeiconsIcon icon={Icon} className="w-5 h-5 text-green-3" strokeWidth={2} />
      </div>
      <h6 className="text-fg-4">{title}</h6>
      <Paragraph className="text-fg-2 text-sm leading-relaxed max-w-50">
        {description}
      </Paragraph>
    </div>
  );
};

export const Benefits = () => {
  return (
    <Section>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-4xl mx-auto">
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