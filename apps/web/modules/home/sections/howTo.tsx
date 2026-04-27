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
import { CDNImage } from "@snappin/ui/components/imagekit/image";
import { Mail02Icon } from "@hugeicons-pro/core-stroke-rounded";
import { AiMagicIcon } from "@hugeicons-pro/core-stroke-rounded";
import { ArrowUpRight01Icon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";

export const HowTo = () => {
  return (
    <Section>
      <SectionHeader align="start">
        <SectionLabel>Get Started</SectionLabel>
        <SectionTitle>Receipt automation in seconds</SectionTitle>
        <SectionDescription>
          Setting things up is as simple as connecting your email account. No
          complex setup or confusing tag manager.
        </SectionDescription>
      </SectionHeader>
      <SectionContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-fit gap-3 items-center">
          <Card className="w-full">
            <CardHeader className="relative flex h-76 overflow-hidden">
              <div className="flex justify-between w-full items-center">
                <CDNImage
                  src="/static/images/landing/connect_source.png"
                  alt="Snappin email monitoring setup"
                  imageClassName="object-contain"
                />
              </div>
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/1"></div>
              <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-card to-transparent" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col pt-4 text-start gap-3">
                <div className="rounded-full flex items-start justify-start">
                  <HugeiconsIcon
                    icon={Mail02Icon}
                    strokeWidth={2}
                    className="size-5 text-blue-3"
                  />
                </div>
                <h3 className="font-medium text-fg-4 flex items-start justify-start">
                  Connect Source
                </h3>
                <p className="leading-relaxed font-normal text-fg-2 text-sm">
                  Invoices from your emails automatically extracted
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardHeader className="relative flex h-76 overflow-hidden">
              <div className="absolute flex justify-between w-full items-center">
                <CDNImage
                  src="/static/images/landing/invoice_data_extracted.png"
                  alt="Snappin receipt data extracted result table"
                  className="min-w-xl p-2 rounded-md pb-0 h-46"
                  imageClassName="object-fill border border-bg-2 p-1 rounded-sm"
                />
              </div>
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/1"></div>
              <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-card to-transparent" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col text-start items-start pt-4 gap-3">
                <div className="flex items-start justify-start">
                  <HugeiconsIcon
                    icon={AiMagicIcon}
                    strokeWidth={2}
                    className="size-5 text-green-3"
                  />
                </div>
                <h3 className="font-medium text-fg-4 flex items-start text-start">
                  AI extracts
                </h3>
                <p className="leading-relaxed font-normal text-fg-2 text-sm">
                  Vendor, line items are extracted using powerful ai model
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardHeader className="relative flex h-76 overflow-hidden">
              <div className="flex justify-center gap-4 w-full items-center">
                <CDNImage
                  src="/static/images/landing/xero.png"
                  alt="xero logo"
                  className="size-10"
                  imageClassName="object-contain"
                />
                <CDNImage
                  src="/static/images/landing/quickbooks.png"
                  alt="quickbook logo"
                  className="size-11"
                  imageClassName="object-contain"
                />
                <CDNImage
                  src="/static/images/landing/google_drive.png"
                  alt="google drive logo"
                  className="size-10"
                  imageClassName="object-contain"
                />
              </div>
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/1"></div>
              <div className="absolute inset-x-0 bottom-0 h-18 bg-linear-to-t from-card to-transparent" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col pt-4 text-start gap-3">
                <div className="">
                  <HugeiconsIcon
                    icon={ArrowUpRight01Icon}
                    className="size-5 text-yellow-4"
                  />
                </div>
                <h3 className="font-medium text-fg-4">
                  Export to other apps
                </h3>
                <p className="leading-relaxed font-normal text-fg-2 text-sm">
                  Push invoices to Xero, or your tools in seconds.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </SectionContent>
    </Section>
  );
};
