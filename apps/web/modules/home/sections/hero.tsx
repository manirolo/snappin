import React from "react";
// import { Section } from "../../../components/layout/sectionLayout";
import { H1, Lead } from "@snappin/ui/components/typography";
import { Button } from "@snappin/ui/components/button";
import Link from "next/link";
import { CDNImage } from "@snappin/ui/components/imagekit/image";
// import {
//   // HiStar,
//   HiMail,
//   HiUserGroup,
//   HiSparkles,
//   HiSwitchHorizontal,
// } from "react-icons/hi";
// import { FaWhatsapp } from "react-icons/fa";

// const FEATURES = [
//   { icon: HiMail, label: "Email Scanning" },
//   { icon: FaWhatsapp, label: "WhatsApp" },
//   { icon: HiUserGroup, label: "Team Expenses" },
//   { icon: HiSparkles, label: "AI Processing" },
//   { icon: HiSwitchHorizontal, label: "Sync & Export" },
// ];

const LOGOS = [
  {
    src: "/static/images/landing/xero.png?updatedAt=1777010506604",
    alt: "xero logo",
    className: "size-7",
  },
  {
    src: "/static/images/landing/intuit%20quickbooks.png",
    alt: "quickbooks logo",
    className: "w-24",
  },
  {
    src: "/static/images/landing/product%20hunt.png",
    alt: "product hunt logo",
    className: "w-28",
  },
  {
    src: "/static/images/landing/toolify.png",
    alt: "toolify logo",
    className: "w-24",
  },
  {
    src: "/static/images/landing/theres%20an%20ai%20for%20that.png",
    alt: "there is an ai for that logo",
    className: "w-46",
  },
];

export const HeroSection = () => {
  return (
    <div className="relative xl:px-0">
      <div className="relative  mt-4 py-16  md:py-20 md:pb-14 px-4 flex flex-col items-center gap-5">
        {/* <div className="flex items-center mb-1 gap-2">
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
        </div> */}
        <div className="flex flex-col items-center">
          <H1 className="mt-5 text-5xl/18 md:text-6xl/20 tracking-tighter font-medium max-w-2xl text-center">
            AI receipt organizer
            <span className="block"> for traveling teams</span>
          </H1>
        </div>
        <div>
          <Lead className="text-center text-fg-2 leading-relaxed max-w-lg mx-auto">
            Send your receipts straight from your WhatsApp and Snappin extracts
            data and sync with your accounting tools.
          </Lead>
        </div>
        <div className="flex flex-col items-center gap-4 mt-4">
          <div className="flex flex-col sm:flex-row w-full md:w-fit gap-2 items-center">
            <Button
              className="w-full text-sm/3"
              size={"xl"}
              asChild
            >
              <Link href={"/signup"}>Get Started for Free</Link>
            </Button>
          </div>
          <span className="text-fg-1 text-xs font-normal">
            Free plan. No credit card required
          </span>
        </div>

        {/* ── Feature pills row ── */}
        {/* <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 mt-8">
          {FEATURES.map(({ icon: Icon, label }, i) => (
            <React.Fragment key={label}>
              <span className="flex items-center gap-1.5 text-fg-2 text-sm">
                <Icon className="size-4 shrink-0 text-fg-3" />
                {label}
              </span>
              {i < FEATURES.length - 1 && (
                <span className="text-fg-3 select-none text-xs">•</span>
              )}
            </React.Fragment>
          ))}
        </div> */}

        <div className="relative min-h-[20vh] rounded-4xl max-w-6xl overflow-hidden border-x mt-8 md:mt-12 md:pb-0 border-t border-bg-2 ring ring-bg-3">
          <CDNImage
            className="max-w-full h-fit flex items-start"
            imageClassName="rounded-4xl w-full object-contain border-8 border-bg-2 shadow"
            src="/static/images/landing/Snappin%20hero%20background.png"
            alt="snappin hero background image"
          />
        </div>
      </div>
      <div className="pb-8 pt-8 flex flex-col md:flex-row max-w-6xl mx-auto text-center items-center gap-10">
        <div className="w-fit inline">
          <span className="text-fg-2 text-sm whitespace-nowrap">As seen</span>
        </div>
        <div className="relative w-full overflow-hidden mask-[linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <div className="flex w-max animate-marquee gap-16 hover:paused">
            {/* Render twice for seamless loop */}
            {[...LOGOS, ...LOGOS].map(({ src, alt, className }, i) => (
              <CDNImage
                key={i}
                src={src}
                imageClassName={`${className} opacity-40 hover:opacity-100 transition-all`}
                alt={alt}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
