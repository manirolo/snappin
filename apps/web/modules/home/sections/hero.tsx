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
            <span className="block"></span>
            your invoices.
          </H1>
        </div>
        <div>
          <Lead className="text-center text-fg-3 leading-relaxed max-w-md mx-auto">
            Connect your email accounts to start extracting invoices, and receipts automatically.
          </Lead>
        </div>
        <div className="flex flex-col items-center gap-4 mt-2">
          <div className="flex flex-col sm:flex-row max-w-sm w-full md:w-fit gap-2 items-center">
            <Button radius={"full"} className="w-full rounded-[22px]" size={"lg"} asChild>
              <Link href={"/signup"}>Get Started for Free</Link>
            </Button>
            <Button
              variant={"dim"}
              className="w-full font-semibold rounded-[22px] text-fg-3"
              size={"lg"}
              asChild
            >
              <Link href={"/#"}>Watch demo</Link>
            </Button>
          </div>
          <span className="text-fg-2 text-sm font-normal">Free plan. No credit card required</span>
        </div>

        <div className="relative mx-auto max-w-5xl flex flex-col items-center gap-8 mt-12">
          <Image
            className="max-w-5xl rounded-sm md:rounded-4xl border-8 border-bg-3 h-fit flex items-start"
            imageClassName="rounded-sm md:rounded-4xl object-contain"
            src="/images/landing/snappin_app_screenshot.png"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};
