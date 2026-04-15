"use client";

import React from "react";
import {
  Section,
  SectionDescription,
  SectionHeader,
  SectionContent,
  SectionTitle,
  SectionLabel,
} from "../../../components/layout/sectionLayout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@snappin/ui/components/accordion";

const FAQ_ITEMS = [
  {
    id: "faq-1",
    question: "Can I switch plans at any time?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate the billing accordingly for the remainder of your cycle.",
  },
  {
    id: "faq-2",
    question: "What happens if I exceed my monthly invoice limit?",
    answer:
      "If you exceed your plan's monthly invoice extraction limit, additional extractions will be paused until the next billing cycle. You can upgrade your plan anytime to increase your limit.",
  },
  {
    id: "faq-3",
    question: "Is there a free trial available?",
    answer:
      "We offer a free tier so you can explore the product without a credit card. When you're ready to scale, you can subscribe to a paid plan directly from your dashboard.",
  },
  {
    id: "faq-4",
    question: "How does yearly billing work?",
    answer:
      "With yearly billing, you're charged once for the full year upfront, which effectively gives you 2 months free compared to monthly billing. You can cancel before the next renewal date.",
  },
  {
    id: "faq-5",
    question: "Is my payment information secure?",
    answer:
      "Absolutely. All payments are processed securely via Polar.sh. We never store your card details on our servers. You can cancel your subscription at any time from your billing settings.",
  },
];

export const Faq = () => {
  return (
    <Section>
      <SectionHeader>
        <SectionLabel>FAQ</SectionLabel>
        <SectionTitle>Frequently asked questions</SectionTitle>
        <SectionDescription>
          Quick answers to common questions about pricing, privacy, setup, and
          more.
        </SectionDescription>
      </SectionHeader>
      <SectionContent>
        <div className="max-w-xl mx-auto w-full">
          <Accordion
            type="single"
            collapsible
            className="w-full shadow-none space-y-0.5"
          >
            {FAQ_ITEMS.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="bg-popover shadow-none border-0 px-4 rounded-lg"
              >
                <AccordionTrigger className="text-sm h-10 flex items-center font-medium text-left hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-fg-3">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </SectionContent>
    </Section>
  );
};
