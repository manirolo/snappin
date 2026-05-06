import React from "react";
// import { Section } from "../../../components/layout/sectionLayout";
import { H1, Lead } from "@snappin/ui/components/typography";
import { Button } from "@snappin/ui/components/button";
import Link from "next/link";
import { CDNImage } from "@snappin/ui/components/imagekit/image";
import { HiStar } from "react-icons/hi";
// import { AnnouncementBanner } from "@snappin/ui/components/announcement/banner";

export const HeroSection = () => {
  return (
    <div className="relative max-w-5xl mx-auto py-18  md:py-28 md:pb-8 px-4 xl:px-0">
      <div className="relative flex flex-col gap-4">
        <div className="flex flex-col items-center">
          {/* <AnnouncementBanner
            badgeLabel="NEW"
            href="/blog/snappin-public-beta-launch"
          >
            We launched public beta
          </AnnouncementBanner> */}
          <div className="flex items-center mb-1 gap-2">
            <CDNImage
              src="/static/images/landing/left.png"
              imageClassName="w-7"
              alt="decoration left"
            />
            <div className="space-y-2">
              <p className="text-sm">#1 Receipt Organizing AI</p>
              <div className="flex items-center text-center justify-center gap-0.5 mx-auto">
                {Array.from({ length: 5 }).map((_, i) => (
                  <HiStar className="size-5" key={i} />
                ))}
              </div>
            </div>
            <CDNImage
              src="/static/images/landing/right.png"
              imageClassName="w-7"
              alt="decoration left"
            />
          </div>
          <H1 className="mt-5 text-5xl/13 md:text-5xl/15 tracking-tighter font-semibold max-w-2xl text-center">
            AI Receipt Organizer
            <span className="block font-source! text-6xl/13 md:text-6xl/15 italic">
              {" "}
              for traveling teams
            </span>
          </H1>
        </div>
        <div>
          <Lead className="text-center text-fg-2 leading-relaxed max-w-md mx-auto">
            Connect your email accounts to start extracting invoices, and
            receipts automatically.
          </Lead>
        </div>
        <div className="flex flex-col items-center gap-4 mt-6">
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

        <div className="relative min-h-[20vh] rounded-4xl max-w-5xl mx-auto overflow-hidden border-x mt-8 md:mt-18 md:pb-0 border-t border-bg-3">
          <CDNImage
            className="max-w-fit mx-auto h-fit flex items-start"
            imageClassName="rounded-4xl object-contain border-8 border-bg-2"
            src="/static/images/landing/Snappin%20hero%20background.png"
            alt="snappin hero background image"
          />
        </div>
        <div className="pt-8 flex flex-col md:flex-row text-center items-center gap-12">
          <div className="w-fit inline">
            <span className="text-fg-2 text-sm whitespace-nowrap">As seen</span>
          </div>
          <div className="flex items-center gap-8 justify-between flex-wrap w-full opacity-50">
            <CDNImage
              src="/static/images/landing/xero.png?updatedAt=1777010506604"
              imageClassName="size-8"
              alt="xero logo"
            />
            <CDNImage
              src="/static/images/landing/intuit%20quickbooks.png"
              imageClassName="w-28"
              alt="quickbooks logo"
            />
            <CDNImage
              src="/static/images/landing/product%20hunt.png"
              imageClassName="w-34"
              alt="product hunt logo"
            />
            <CDNImage
              src="/static/images/landing/toolify.png"
              imageClassName="w-32"
              alt="toolify logo"
            />
            <CDNImage
              src="/static/images/landing/theres%20an%20ai%20for%20that.png"
              imageClassName="w-52"
              alt="there is an ai for that logo"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
