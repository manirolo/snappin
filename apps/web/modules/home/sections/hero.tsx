import React from "react";
// import { Section } from "../../../components/layout/sectionLayout";
import { H1, Lead } from "@snappin/ui/components/typography";
import { Button } from "@snappin/ui/components/button";
import Link from "next/link";
import { CDNImage } from "@snappin/ui/components/imagekit/image";
import { DotPattern } from "@snappin/ui/components/magicui/dot-pattern";
import { AnnouncementBanner } from "@snappin/ui/components/announcement/banner";
import { cn } from "@snappin/ui/lib/utils";

export const HeroSection = () => {
  return (
    <div className="mt-20 px-4 xl:px-0">
      <div className="relative flex flex-col gap-5">
        <div className="flex flex-col items-center">
          <AnnouncementBanner
            badgeLabel="NEW"
            href="/blog/snappin-public-beta-launch"
            setTarget_Bank
          >
            We launched public beta
          </AnnouncementBanner>
          <H1 className="mt-6 tracking-tighter text-5xl/14 font-bold max-w-md text-center">
            AI receipt organizer for{" "}
            <span className="font-source! text-6xl/14 italic">
              small business
            </span>
            <span className="block"> </span>
          </H1>
        </div>
        <div>
          <Lead className="text-center text-fg-3 leading-relaxed max-w-sm mx-auto">
            Connect your email accounts to start extracting invoices, and
            receipts automatically.
          </Lead>
        </div>
        <div className="flex flex-col items-center gap-4 mt-3">
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

        <figure className="relative overflow-hidden max-w-5xl w-full mx-auto rounded-[1.25rem] pb-0 md:p-14 mt-6 md:mt-12 md:pb-0">
          <div className="relative rounded-xl min-w-full min-h-fit bg-blue-4 pt-18 border-x border-t border-bg-3 ">
            <DotPattern
              className={cn(
                "mask-[radial-gradient(600px_circle_at_center,white,transparent)]",
                "p-2 [&>circle]:fill-white",
              )}
            />
            <CDNImage
              className="max-w-3xl mx-auto h-fit p-4 translate-y-10 flex items-start"
              imageClassName="rounded-t-xl object-contain shadow-[0_10px_10px_rgba(0,0,0,0.2),inset_0_0_0_1px_rgba(255,255,255,0.1)]"
              src="/static/images/landing/Snappin%20hero%20background.png"
              alt="snappin hero background image"
            />
          </div>
        </figure>
      </div>
    </div>
  );
};
