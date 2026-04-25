import React from "react";
import { PricingPage } from "../../../modules/pricing/pricing.page";
import Script from "next/script";

export default function Page() {
  return (
    <>
      <PricingPage />
      <Script
        id="schema-webpage"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Pricing | Snappin",
            description:
              "Start for free. No credit card required. Upgrade when you're ready",
            url: "https://www.snappinapp.com/pricing",
          }),
        }}
      />
      <Script
        id="schema-product"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: "Snappin",
            description:
              "Start for free. No credit card required. Upgrade when you're ready",
            url: "https://www.snappinapp.com/pricing",
            image: "https://www.snappinapp.com/images/snappin_dark_light.png",
            brand: {
              "@type": "Brand",
              name: "Snappin",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "5",
              reviewCount: "1",
              bestRating: "5",
              worstRating: "0",
            },
            offers: [
              {
                "@type": "Offer",
                name: "Free",
                price: "0",
                priceCurrency: "USD",
                availability: "https://schema.org/InStock",
                url: "https://www.snappinapp.com/pricing",
              },
              {
                "@type": "Offer",
                name: "Pro",
                price: "19",
                priceCurrency: "USD",
                availability: "https://schema.org/InStock",
                url: "https://www.snappinapp.com/pricing",
              },
            ],
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
                name: "Pricing",
                item: "https://www.snappinapp.com/pricing",
              },
            ],
          }),
        }}
      />
    </>
  );
}

export const metadata = {
  title: "Pricing | Snappin App",
  description:
    "Start for free. No credit card required. Upgrade when you're ready",
  keywords: ["snappin app pricing", "invoice extraction pricing", "snappin app"],
  alternates: {
    canonical: "https://www.snappinapp.com/pricing",
  },
  openGraph: {
    title: "Pricing | Snappin App",
    description:
      "Start for free. No credit card required. Upgrade when you're ready",
    url: "https://www.snappinapp.com/pricing",
    siteName: "Snappin",
    images: [
      {
        url: "https://www.snappinapp.comD/images/og.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing | Snappin App",
    description:
      "Start for free. No credit card required. Upgrade when you're ready",
    images: ["https://www.snappinapp.com/images/og.png"],
    creator: "@snappin_ai",
  },
};
