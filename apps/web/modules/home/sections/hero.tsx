import React from "react";
// import { Section } from "../../../components/layout/sectionLayout";
import { H1, Lead } from "@snappin/ui/components/typography";
import { Button } from "@snappin/ui/components/button";
import Link from "next/link";
import { Image } from "@snappin/ui/components/Image";
import { AnnouncementBanner } from "@snappin/ui/components/announcement/banner";

export const HeroSection = () => {
  return (
    <div className="mt-20 px-4 xl:px-0">
      <div className="relative flex flex-col gap-6">
        <div className="flex flex-col items-center">
          <AnnouncementBanner badgeLabel="NEW" href="https://producthunt.com/products/snappin-app" setTarget_Bank>We live on Product Hunt</AnnouncementBanner>
          <H1 className="mt-6 text-center">
            AI that organizes
          </H1>
          <H1 className="text-fg-4 text-center">
            your invoices.
          </H1>
        </div>
        <div>
          <Lead className="text-center leading-relaxed max-w-md mx-auto">
            Connect your email accounts start extracting invoices, receipts and
            bills automatically. No manual work.
          </Lead>
        </div>
        <div className="flex flex-col items-center gap-4 mt-2">
          <div className="flex flex-col sm:flex-row gap-2 items-center">
            <Button radius={"full"} className="w-full rounded-[22px]" size={"lg"} asChild>
              <Link href={"/signup"}>Get Started for Free</Link>
            </Button>
            {/* <Button
              variant={"dim"}
              className="w-full font-semibold rounded-[22px] text-fg-3"
              size={"lg"}
              asChild
            >
              <Link href={"/signup"}>Watch demo</Link>
            </Button> */}
          </div>
        </div>

        <div className="relative mx-auto max-w-4xl flex flex-col items-center gap-8 mt-12">
          <Image
            className="max-w-4xl rounded-sm md:rounded-4xl border border-bg-3 h-fit flex items-start"
            imageClassName="rounded-sm md:rounded-4xl object-contain"
            src="/images/landing/snappin_app_screenshot.png"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};
