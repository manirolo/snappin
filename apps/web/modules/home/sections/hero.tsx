import React from "react";
// import { Section } from "../../../components/layout/sectionLayout";
import { H1, Lead } from "@snappin/ui/components/typography";
import { Button } from "@snappin/ui/components/button";
import Link from "next/link";
import { CDNImage } from "@snappin/ui/components/imagekit/image";
import { AnnouncementBanner } from "@snappin/ui/components/announcement/banner";

export const HeroSection = () => {
  return (
    <div className="mt-12 px-4 xl:px-0">
      <div className="relative flex flex-col gap-7">
        <div className="flex flex-col items-center">
          <AnnouncementBanner
            badgeLabel="NEW"
            href="/blog/snappin-public-beta-launch"
            setTarget_Bank
          >
            We launched public beta
          </AnnouncementBanner>
          <H1 className="mt-8 text-center">
            AI receipt organizer
            <span className="block"> </span>
            for small business
          </H1>
        </div>
        <div>
          <Lead className="text-center text-fg-1 leading-relaxed max-w-sm mx-auto">
            Connect your email accounts to start extracting invoices, and
            receipts automatically.
          </Lead>
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col sm:flex-row max-w-sm w-full md:w-fit gap-2 items-center">
            <Button
              radius={"full"}
              className="w-full"
              size={"lg"}
              asChild
            >
              <Link href={"/signup"}>Get Started for Free</Link>
            </Button>
          </div>
          <span className="text-fg-1 text-sm font-normal">
            Free plan. No credit card required
          </span>
        </div>

        <figure className="relative overflow-hidden max-w-5xl mx-auto bg-bg-2 aspect-video rounded-[1.25rem] p-8 pb-0 md:p-14 mt-6 md:mt-12 md:pb-0">
          <div className="h-full overflow-hidden rounded-t-xl border-x border-t border-bg-4 shadow-[0_10px_30px_rgba(0,0,0,0.1),inset_0_0_0_1px_rgba(255,255,255,0.1)]">
            <div
              aria-hidden="true"
              className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-bg-3 bg-background px-3 py-1.75"
            >
              <div className="group flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full transition-colors duration-200 ease-out bg-[#ff5f57]"></span>
                <span className="h-2.5 w-2.5 rounded-full transition-colors duration-200 ease-out bg-[#febc2e]"></span>
                <span className="h-2.5 w-2.5 rounded-full transition-colors duration-200 ease-out bg-[#28c840]"></span>
              </div>
              <div className="flex min-w-50 items-center justify-center rounded-md bg-muted px-3 py-0.5">
                <span className="text-muted-foreground text-[11px] tracking-[-0.005em]">
                  snappinapp.com
                </span>
              </div>
              <div></div>
            </div>
            <CDNImage
              className="max-w-4xl h-fit flex items-start"
              imageClassName="rounded-sm md:rounded-5xl object-contain"
              src="/static/images/landing/Snappin%20hero%20background.png"
              alt="snappin hero background image"
            />
          </div>
        </figure>
      </div>
    </div>
  );
};
