import React from "react";
import dynamic from "next/dynamic";
import { HeroSection } from "./sections/hero";

const AsSeen = dynamic(() => import("./sections/asseen").then((mod) => mod.AsSeen));
const Problem = dynamic(() =>
  import("./sections/problem").then((mod) => mod.Problem),
);

const MessageUs = dynamic(() =>
  import("./sections/messageUs").then((mod) => mod.MessageUs),
);

const WhyUs = dynamic(() =>
  import("./sections/whyus").then((mod) => mod.WhyUs),
);

const Faq = dynamic(() => import("./sections/faq").then((mod) => mod.Faq));

const Cta = dynamic(() => import("./sections/cta").then((mod) => mod.Cta));

export const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <AsSeen />
      <Problem />
      <MessageUs />
      <WhyUs />
      <Faq />
      <Cta />
    </div>
  );
};
