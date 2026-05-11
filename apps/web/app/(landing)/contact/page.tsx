import React from "react";
import { ContactPage } from "../../../modules/contact/contact.page";
import Script from "next/script";

export default function Page() {
  return (
    <>
      <ContactPage />
      <Script
        id="schema-contactpage"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contact | Snappin",
            description:
              "Questions about setup, billing, privacy, or anything else? We're happy to help.",
            url: "https://www.snappinapp.com/contact",
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
  title: "Contact | Snappin",
  description:
    "Questions about setup, billing, privacy, or anything else? We're happy to help.",
  keywords: ["Snappin contact", "invoice extraction contact", "Snappin"],
  alternates: {
    canonical: "https://www.snappinapp.com/contact",
  },
  openGraph: {
    title: "Contact | Snappin",
    description:
      "Questions about setup, billing, privacy, or anything else? We're happy to help.",
    url: "https://www.snappinapp.com/contact",
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
    title: "Contact | Snappin",
    description:
      "Questions about setup, billing, privacy, or anything else? We're happy to help.",
    images: ["https://www.snappinapp.com/images/og.png"],
    creator: "@snappin_ai",
  },
};
