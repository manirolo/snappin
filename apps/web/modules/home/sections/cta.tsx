import { Card, CardContent } from "@snappin/ui/components/card";
import React from "react";
import {
  Section,
  SectionContent,
} from "../../../components/layout/sectionLayout";
import { H2, Paragraph } from "@snappin/ui/components/typography";
import { Button } from "@snappin/ui/components/button";
import Link from "next/link";

export const Cta = () => {
  return (
    <Section>
      <SectionContent>
        <Card className="rounded-3xl bg-transparent shadow-none border-0 h-fit sm:h-50">
          <CardContent className="flex justify-center items-center">
            <div className="flex flex-col items-center gap-4 justify-center text-center">
              <H2>
               Ready to get started?
              </H2>
              <Paragraph className="max-w-md text-fg-3 leading-relaxed">
                Start extracting invoices in seconds
              </Paragraph>
              <div className="flex flex-col sm:flex-row items-center gap-2 mt-2">
                <Button
                  radius={"full"}
                  className="w-full sm:w-auto"
                  size={"lg"}
                  asChild
                >
                  <Link href={"/signup"}>Get Started for Free</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </SectionContent>
    </Section>
  );
};
