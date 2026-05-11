import React from "react";
import { PrivacyPolicy } from "../../../modules/policies/privacy";
import Script from "next/script";

export default function Page() {
  return (
    <>
      <PrivacyPolicy />
      <Script
        id="schema-webpage"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Privacy Policy | Snappin",
            description:
              "How we protect your privacy, what data we collect, and your rights over your information. Your data always belongs to you, not us.",
            url: "https://www.snappinapp.com/privacy",
            publisher: {
              "@type": "Organization",
              name: "Snappin",
              url: "https://www.snappinapp.com",
            },
          }),
        }}
      />
    </>
  );
}

export const metadata = {
  title: "Privacy | Snappin",
  description:
    "How we protect your privacy, what data we collect, and your rights over your information. Your data always belongs to you, not us.",
  keywords: ["Snappin privacy", "invoice extraction privacy", "Snappin"],
  alternates: {
    canonical: "https://www.snappinapp.com/privacy",
  },
  openGraph: {
    title: "Privacy | Snappin",
    description:
      "How we protect your privacy, what data we collect, and your rights over your information. Your data always belongs to you, not us.",
    url: "https://www.snappinapp.com/privacy",
    siteName: "Snappin",
    images: [
      {
        url: "https://www.snappinapp.com/images/og.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy | SnaSnappinppin",
    description:
      "How we protect your privacy, what data we collect, and your rights over your information. Your data always belongs to you, not us.",
    images: ["https://www.snappinapp.com/images/og.png"],
    creator: "@snappin_ai",
  },
};
