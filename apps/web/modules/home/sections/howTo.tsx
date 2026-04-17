import React from "react";
import {
  Section,
  SectionContent,
  SectionDescription,
  SectionHeader,
  SectionLabel,
  SectionTitle,
} from "../../../components/layout/sectionLayout";
import { Card, CardContent, CardHeader } from "@snappin/ui/components/card";
import { Image } from "@snappin/ui/components/Image";

export const HowTo = () => {
  return (
    <Section>
      <SectionHeader>
        <SectionLabel>How it works</SectionLabel>
        <SectionTitle>How to Get Started</SectionTitle>
        <SectionDescription>
          Setting things up is as simple as connecting your email account. No
          complex setup or confusing tag manager.
        </SectionDescription>
      </SectionHeader>
      <SectionContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-center mx-auto max-w-fit gap-4 items-center">
          <Card className="w-full max-w-xs">
            <CardHeader className="flex border-b border-bg-3 h-76">
              <div className="flex justify-between w-full  items-center">
                <Image
                  src="/images/landing/connect_source.png"
                  alt="google logo"
                  imageClassName="object-contain"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col text-center gap-4">
                <div className="bg-white border border-bg-2 size-9 mx-auto text-green-3 flex items-center justify-center rounded-full p-2">
                  01
                </div>
                <h6 className="leading-relaxed text-md">
                  Connect Source.{" "}
                  <span className="text-fg-3">
                    Invoices from your emails automatically extracted
                  </span>
                </h6>
              </div>
            </CardContent>
          </Card>
          <Card className="w-full max-w-xs">
            <CardHeader className="relative flex border-b border-bg-3 h-76">
              <div className="absolute translate-x-4 flex justify-between w-full items-center">
                <Image
                  src="/images/landing/invoice_data_extracted.png"
                  alt="google logo"
                  className="min-w-lg border border-bg-3 p-2 rounded-md pb-0 h-46"
                  imageClassName="object-fill"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col text-center gap-4">
                <div className="bg-white border border-bg-2 size-9 mx-auto text-green-3 flex items-center justify-center rounded-full p-2">
                  02
                </div>
                <h6 className="leading-relaxed text-md">
                  AI extracts.{" "}
                  <span className="text-fg-3">
                    Vendor, line items are extracted using powerful ai model
                  </span>
                </h6>
              </div>
            </CardContent>
          </Card>
          <Card className="w-full max-w-xs">
            <CardHeader className="flex border-b border-bg-3 h-76">
              <div className="flex justify-center translate-x-8 gap-4 w-full items-center">
                <Image
                  src="/images/vendors/logos/xero.png"
                  alt="xero logo"
                  className="size-14"
                  imageClassName="object-contain"
                />
                <Image
                  src="/images/vendors/logos/quickbooks.png"
                  alt="xero logo"
                  className="size-10"
                  imageClassName="object-contain"
                />
                <Image
                  src="/images/vendors/logos/google_drive.png"
                  alt="xero logo"
                  className="size-6"
                  imageClassName="object-contain"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col text-center gap-4">
                <div className="bg-white border border-bg-2 size-9 mx-auto text-green-3 flex items-center justify-center rounded-full p-2">
                  03
                </div>
                <h6 className="leading-relaxed text-md">
                  Export to other apps.{" "}
                  <span className="text-fg-3">
                    Push invoices to Xero, or your tools in seconds.
                  </span>
                </h6>
              </div>
            </CardContent>
          </Card>
        </div>
      </SectionContent>
    </Section>
  );
};
