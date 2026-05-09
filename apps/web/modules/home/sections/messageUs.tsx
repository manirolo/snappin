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
import { CurlyArrow2 } from "@snappin/ui/assets/svg/arrow";
import { DotPattern } from "@snappin/ui/components/magicui/dot-pattern";

export const MessageUs = () => {
  return (
    <Section>
      <SectionHeader>
        <SectionLabel>Whatsapp</SectionLabel>
        <SectionTitle>
          No installation.{" "}
          <span className="block text-fg-3"> Send receipt on WhatsApp </span>
        </SectionTitle>
        <SectionDescription>
          Snappin AI fits right into your workflow. Just send receipts on
          WhatsApp and it takes care of the rest, reducing manual work, saving
          time, and keeping everything organized.
        </SectionDescription>
      </SectionHeader>

      <SectionContent>
        {/* https://ik.imagekit.io/kk3yk561o/v1 */}
        <div className="relative bg-gray-a1 pt-9 rounded-xl overflow-hidden">
          <DotPattern className="p-4 -z-10 [&_circle]:fill-gray-a2" />

          <div className="absolute hidden sm:flex flex-col items-center top-60 left-1/2 -translate-x-62 -rotate-3">
            <span className="text-sm text-fg-1">2.</span>
            <span className="text-sm text-fg-4">AI process it</span>
            <CurlyArrow2 className="w-12 h-12 translate-x-6" />
          </div>
          <CDNImage
            className="max-w-2xl z-10 mx-auto h-fit flex items-start"
            src="/static/images/landing/Android%20whatsapp%20demo.png"
            alt="snappin hero background image"
          />
          <div className="absolute hidden sm:flex flex-col items-center top-20 right-1/2 translate-x-71 rotate-3">
            <span className="text-sm text-fg-1">1.</span>
            <span className="text-sm text-fg-4">Send your receipts</span>
            <CurlyArrow2 className="w-12 h-12 scale-x-[-1] -translate-x-6" />
          </div>

          <div className="absolute hidden sm:flex flex-col items-center top-100 right-1/2 translate-x-69 rotate-3">
            <span className="text-sm text-fg-1">3.</span>
            <span className="text-sm text-fg-4">Synced with Xero</span>
            <CurlyArrow2 className="w-12 h-12 scale-x-[-1] -translate-x-6" />
          </div>
        </div>
      </SectionContent>
    </Section>
  );
};
