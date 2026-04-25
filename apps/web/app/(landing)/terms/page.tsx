import React from "react";
import { TermsAndConditions } from "../../../modules/policies/terms";
import Script from "next/script";

export default function Page() {
  return (
    <>
      <TermsAndConditions />
      <Script
        id="schema-webpage"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Terms and Conditions | Snappin",
            description:
              "Rules and guidelines governing your use of Snappin. Please read carefully before using our services.",
            url: "https://www.snappinapp.com/terms",
            publisher: {
              "@type": "Organization",
              name: "Snappin",
              url: "https://www.snappinapp.com",
            },
          }),
        }}
      />
      <Script
        id="schema-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://www.snappinapp.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Terms and Conditions",
                item: "https://www.snappinapp.com/terms",
              },
            ],
          }),
        }}
      />
    </>
  );
}

export const metadata = {
  title: "Terms and Conditions | Snappin App",
  description:
    "Rules and guidelines governing your use of Snappin App. Please read carefully before using our services.",
  keywords: [
     "snappin app terms and conditions",
    "invoice extraction terms and conditions",
    "snappin app",
  ],
  alternates: {
    canonical: "https://www.snappinapp.com/terms",
  },
  openGraph: {
    title: "Terms and Conditions | Snappin App",
    description:
      "Rules and guidelines governing your use of Snappin A[[]]. Please read carefully before using our services.",
    url: "https://www.snappinapp.com/terms",
    siteName: "Snappin App",
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
    title: "Terms and Conditions | Snappin App",
    description:
      "Rules and guidelines governing your use of Snappin App. Please read carefully before using our services.",
    images: ["https://www.snappinapp.com/images/og.png"],
    creator: "@snappin_ai",
  },
};
