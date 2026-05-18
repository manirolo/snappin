import React from "react";
import { Button } from "@snappin/ui/components/button";
import Link from "next/link";
import { CDNImage } from "@snappin/ui/components/imagekit/image";

export const HeroSection = () => {
  return (
    <div className="relative xl:px-0">
      <div className="relative mt-4 pt-12  md:pt-14 px-4 flex flex-col items-center gap-5">
        <div className="flex flex-col items-center">
          <h1 className="mt-5 text-5xl/16 md:text-6xl/20 tracking-tighter font-medium max-w-2xl text-center">
            AI receipt organizer
            <span className="block"> for traveling teams</span>
          </h1>
        </div>
        <div>
          <p className="text-center text-base/8 text-fg-2 leading-relaxed max-w-lg mx-auto">
            Send your receipts straight from your WhatsApp and Snappin extracts
            data and sync with your accounting tools.
          </p>
        </div>
        <div className="flex flex-col items-center gap-4 mt-4">
          <div className="flex flex-col sm:flex-row w-full md:w-fit gap-2 items-center">
            <Button className="w-full text-sm/3" size={"xl"} asChild>
              <Link href={"/signup"}>Get Started for Free</Link>
            </Button>
          </div>
          <span className="text-fg-2 text-xs font-normal">
            Free plan. No credit card required
          </span>
        </div>

        <div className="relative min-h-[20vh] rounded-4xl max-w-6xl overflow-hidden border-x mt-8 md:mt-12 md:pb-0 border-t border-bg-2 ring ring-bg-3">
          <CDNImage
            className="max-w-full h-fit flex items-start"
            imageClassName="rounded-4xl w-full object-contain border-8 border-bg-2 shadow"
            src="/static/images/landing/demos/Snappin%20hero%20background.webp"
            alt="snappin hero background image"
            fetchPriority="high"
            priority
          />
        </div>
      </div>
    </div>
  );
};
