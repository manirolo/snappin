import React from "react";
import {
  Section,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from "../../../components/layout/sectionLayout";
import { Card, CardContent } from "@snappin/ui/components/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mail02Icon } from "@hugeicons-pro/core-stroke-rounded";
import { Small } from "@snappin/ui/components/typography";
import Link from "next/link";

export const ContactSection = () => {
  return (
    <Section className="pt-4">
      <SectionHeader>
        <SectionTitle>Contact</SectionTitle>
        <SectionDescription className="text-sm max-w-sm mt-4 leading-relaxed text-fg-2">
          Questions about setup, billing, privacy, or anything else? We&#39;re
          happy to help.
        </SectionDescription>

        <SectionContent className="pt-6">
          <div className="grid grid-cols-1 w-full mt-8">
            <Link href="mailto:mani@snappinapp.com">
              <Card className="min-w-full hover:bg-bg-1 transition-all duration-300 cursor-pointer max-w-70">
                <CardContent className="flex flex-col items-center max-w-50 gap-1 justify-center text-center">
                  <div className="w-fit mx-auto shadow-xs border border-bg-3 text-fg-2 bg-bg-2 p-1.5 rounded-full px-4">
                    <HugeiconsIcon strokeWidth={1.9} icon={Mail02Icon} />
                  </div>
                  <h6 className="mt-2">Email</h6>
                  <Small>We read them all, we promise</Small>
                </CardContent>
              </Card>
            </Link>
          </div>
        </SectionContent>
      </SectionHeader>
    </Section>
  );
};
