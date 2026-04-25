import React from "react";
import { HomeBlog } from "../../../modules/blog/home.blog";
import Script from "next/script";

export default function Page() {
  return (
    <>
      <HomeBlog />
      <Script
        id="schema-blog"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Snappin Blog",
            description: "Latest updates and news from Snappin",
            url: "https://www.snappinapp.com/blog",
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
                name: "Blog",
                item: "https://www.snappinapp.com/blog",
              },
            ],
          }),
        }}
      />
    </>
  );
}

export const metadata = {
  title: "Blog | Snappin App",
  description: "Latest updates and news from Snappin App",
  keywords: ["snappin app blog", "invoice extraction blog", "snappin app"],
  alternates: {
    canonical: "https://www.snappinapp.com/blog",
  },
  openGraph: {
    title: "Blog | Snappin App",
    description: "Latest updates and news from Snappin App",
    url: "https://www.snappinapp.com/blog",
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
    title: "Blog | Snappin App",
    description: "Latest updates and news from Snappin App",
    images: ["https://www.snappinapp.com/images/og.png"],
    creator: "@snappin_ai",
  },
};
