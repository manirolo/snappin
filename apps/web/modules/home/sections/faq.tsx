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
import Script from "next/script";

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
      "Absolutely. All payments are processed securely via LemonSqueezy. We never store your card details on our servers. You can cancel your subscription at any time from your billing settings.",
  },
  {
    id: "faq-6",
    question: "Which platforms does Snappin support?",
    answer:
      "Snappin works with Gmail, Outlook, WhatsApp, and supports exports to tools like Xero and Google Drive.",
  },
  {
    id: "faq-7",
    question: "How accurate is the receipt extraction?",
    answer:
      "Snappin uses AI-powered OCR to extract key receipt details like merchant name, total amount, date, and tax with high accuracy.",
  },
  {
    id: "faq-8",
    question: "Do you support multi-page invoices and PDFs?",
    answer:
      "Yes, Snappin supports image receipts, PDFs, and multi-page invoices from emails and uploads.",
  },
  {
    id: "faq-9",
    question: "Can I organize receipts automatically?",
    answer:
      "Yes, receipts are automatically categorized and organized so you can quickly search, export, and manage them later.",
  },
  {
    id: "faq-10",
    question: "Do I need accounting knowledge to use Snappin?",
    answer:
      "No. Snappin is designed for freelancers, travelers, bookkeepers, and businesses with a simple setup process.",
  },
  {
    id: "faq-11",
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes, you can cancel your subscription anytime from your billing settings. Your plan will remain active until the end of the billing cycle.",
  },
  {
    id: "faq-12",
    question: "Does Snappin store my receipts securely?",
    answer:
      "Yes, all receipts and extracted data are stored securely with encrypted infrastructure and secure authentication.",
  },
];

export const Faq = () => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
  return (
    <>
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
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
              className="w-full shadow-none space-y-2"
            >
              {FAQ_ITEMS.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="shadow-none border-0 px-4 rounded-lg"
                >
                  <AccordionTrigger className="text-base h-10 flex items-center tracking-tight font-medium text-left hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base font-normal tracking-tight leading-relaxed text-fg-3">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </SectionContent>
      </Section>
    </>
  );
};
