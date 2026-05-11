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
    </>
  );
}

export const metadata = {
  title: "Blog | Snappin",
  description: "Latest updates and news from Snappin",
  keywords: ["Snappin blog", "invoice extraction blog", "Snappin"],
  alternates: {
    canonical: "https://www.snappinapp.com/blog",
  },
  openGraph: {
    title: "Blog | Snappin",
    description: "Latest updates and news from Snappin",
    url: "https://www.snappinapp.com/blog",
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
    title: "Blog | Snappin",
    description: "Latest updates and news from Snappin",
    images: ["https://www.snappinapp.com/images/og.png"],
    creator: "@snappin_ai",
  },
};
