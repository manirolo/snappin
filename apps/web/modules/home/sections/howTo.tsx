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

export const HowTo = () => {
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
        <CDNImage
          className="max-w-sm mx-auto h-fit p-4 flex items-start"
          src="/static/images/landing/Frame%20238.png"
          alt="snappin hero background image"
        />
      </SectionContent>
    </Section>
  );
};
