import React from "react";
import { ContactSection } from "./sections/contact.section";
import dynamic from "next/dynamic";

const Faq = dynamic(() => import("../home/sections/faq").then((mod) => mod.Faq));
export const ContactPage = () => {
  return (
   <div>
    <ContactSection />
    <Faq />
   </div>
  );
};
