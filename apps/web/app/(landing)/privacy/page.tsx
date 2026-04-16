import React from "react";
import { PrivacyPolicy } from "../../../modules/policies/privacy";

export default function Page() {
  return <PrivacyPolicy />;
}

export const metadata = {
  title: "Privacy",
  description:
    "How we protect your privacy, what data we collect, and your rights over your information. Your data always belongs to you, not us.",
  keywords: ["snappin privacy", "invoice extraction privacy", "snappin"],
};
