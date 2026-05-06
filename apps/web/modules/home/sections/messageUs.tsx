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

export const MessageUs = () => {
  return (
    <Section>
      <SectionHeader>
        <SectionLabel>Whatsapp</SectionLabel>
        <SectionTitle>Message us receipt on the go</SectionTitle>
        <SectionDescription>
          Snappin AI fits right into your workflow. Just send receipts on
          WhatsApp and it takes care of the rest, reducing manual work, saving
          time, and keeping everything organized.
        </SectionDescription>
      </SectionHeader>

      <SectionContent>
        {/* https://ik.imagekit.io/kk3yk561o/v1 */}
        <div className="relative overflow-hidden">
          <CDNImage
            className="max-w-2xl mx-auto h-fit flex items-start"
            src="/static/images/landing/Android%20whatsapp%20demo.png"
            alt="snappin hero background image"
          />
          <div className="absolute hidden sm:flex flex-col items-center top-20 right-1/2 translate-x-69 rotate-3">
            <span className="text-sm">Send your receipts</span>
            <CurlyArrow2 className="w-12 h-12 scale-x-[-1] -translate-x-6" />
          </div>
        </div>
      </SectionContent>
    </Section>
  );
};
