import React from "react";
// import { Section } from "../../../components/layout/sectionLayout";
import { H1, Lead } from "@snappin/ui/components/typography";
import { Button } from "@snappin/ui/components/button";
import Link from "next/link";
import { CDNImage } from "@snappin/ui/components/imagekit/image";
import { AnnouncementBanner } from "@snappin/ui/components/announcement/banner";

export const HeroSection = () => {
  return (
    <div className="relative md:py-28 md:pb-8 px-4 xl:px-0">
      <div className="relative flex flex-col gap-6">
        <div className="flex flex-col items-center">
          <AnnouncementBanner
            badgeLabel="NEW"
            href="/blog/snappin-public-beta-launch"
          >
            We launched public beta
          </AnnouncementBanner>
          <H1 className="mt-6 text-6xl/19 tracking-tighter font-semibold max-w-2xl text-center">
           AI Receipt Organizer
            <span className="block">{" "}</span>
          </H1>
        </div>
        <div>
          <Lead className="text-center text-fg-3 leading-relaxed max-w-md mx-auto">
            Connect your email accounts to start extracting invoices, and
            receipts automatically.
          </Lead>
        </div>
        <div className="flex flex-col items-center gap-4 mt-4">
          <div className="flex flex-col sm:flex-row max-w-sm w-full md:w-fit gap-2 items-center">
            <Button
              radius={"full"}
              className="w-full text-sm/3"
              size={"lg"}
              asChild
            >
              <Link href={"/signup"}>Get Started for Free</Link>
            </Button>
          </div>
          <span className="text-fg-1 text-xs font-normal">
            Free plan. No credit card required
          </span>
        </div>

        <div className="relative rounded-xl max-w-4xl mx-auto overflow-hidden min-h-fit border-x mt-8 md:mt-18 md:pb-0 border-t border-bg-3">
          <CDNImage
            className="max-w-fit mx-auto h-fit flex items-start"
            imageClassName="rounded-t-xl object-contain border-8 border-bg-2"
            src="/static/images/landing/Snappin%20hero%20background.png"
            alt="snappin hero background image"
          />
        </div>
      </div>
    </div>
  );
};
