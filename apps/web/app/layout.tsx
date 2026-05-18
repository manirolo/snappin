import type { Metadata, Viewport } from "next";
import "@snappin/ui/globals.css";
import { env } from "@snappin/env";
import { Fuzzy_Bubbles, Stack_Sans_Text } from "next/font/google";
import { MarketingProviders } from "./provider";
import Script from "next/script";

const inter = Stack_Sans_Text({
  subsets: ["latin"],
  variable: "--font-stacks",
  adjustFontFallback: true,
  fallback: ["system-ui", "Arial", "sans-serif"],
  display: "swap",
});

const fuzzyBubbles = Fuzzy_Bubbles({
  weight: ["400", "700"],
  variable: "--font-fuzzy-bubbles",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Snappin – AI Receipt Organizer",
  description:
    "Turn hours of manual receipt collection and organizing work into seconds. Extract receipts from emails and send receipts via WhatsApp—instantly organized and ready to use.",

  metadataBase: new URL("https://www.snappinapp.com"),

  openGraph: {
    title: "Snappin – AI Receipt Organizer",
    description:
      "AI-powered receipt collection automation. Extract from emails & WhatsApp.",
    url: "https://www.snappinapp.com",
    siteName: "Snappin",
    images: [
      {
        url: "/images/og.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Snappin – AI Receipt Organizer",
    description:
      "AI-powered receipt collection automation from emails & WhatsApp.",
    images: ["/images/og.png"],
    creator: "@snappin_ai",
  },

  alternates: {
    canonical: "https://www.snappinapp.com",
  },

  keywords: [
    "invoice extraction",
    "receipt ai",
    "receipt organizing ai",
    "invoice extraction automation n8n",
    "receipt extraction tool",
    "invoice extraction tool",
    "outlook receipt extractor",
    "receipt management for travelers",
    "receipt ai alternative",
    "receiptor ai alternative",
    "tailride alternative",
    "wellybox alternative",
    "sparkreceipt alternative",
    "get invoice alternative",
    "low price ocr tool",
    "ocr api",
    "snappin",
    "snappin app",
    "snappin ai",
    "snappin ocr",
    "snappin receipt organizer",
    "ai receipt scanner",
    "receipt management software",
    "receipt organizer app",
    "receipt tracking software",
    "expense receipt organizer",
    "receipt processing automation",
    "ai bookkeeping automation",
    "gmail receipt extractor",
    "whatsapp receipt organizer",
    "receipt parser",
    "receipt ocr",
    "invoice ocr API",
    "receipt extraction API",
    "automated expense tracking",
    "digital receipt organizer",
    "travel receipt organizer",
    "small business receipt management",
    "xero receipt automation",
    "quickbooks receipt automation",
    "email receipt extraction",
  ],

  applicationName: "Snappin",
  creator: "Snappin",
  publisher: "Snappin",
  generator: "Snappin",
  robots: {
    index: env.env == "production" ? true : false,
    follow: env.env == "production" ? true : false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://ik.imagekit.io" />
        <link rel="dns-prefetch" href="https://ik.imagekit.io" />
        {env.env === "production" && (
          <>
            <link rel="dns-prefetch" href="https://cloud.umami.is" />
            <link rel="preconnect" href="https://cloud.umami.is" />
          </>
        )}
      </head>
      <body
        className={`${fuzzyBubbles.variable} ${inter.variable}`}
        suppressHydrationWarning
      >
        {env.env === "production" && (
          <Script
            src="https://cloud.umami.is/script.js"
            data-website-id="94baed4a-1510-4b34-8f86-30d1bfda676a"
            strategy="lazyOnload"
          />
        )}
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Snappin",
              alternateName: ["Snappin AI", "Snappin"],
              url: "https://www.snappinapp.com",
            }),
          }}
        />
        <Script
          id="schema-software"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Snappin",
              operatingSystem: "Web",
              applicationCategory: "BusinessApplication",
              description:
                "AI-powered receipt collection and organizing automation from emails & WhatsApp.",
              url: "https://www.snappinapp.com",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
            }),
          }}
        />
        <Script
          id="schema-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Snappin",
              url: "https://www.snappinapp.com",
              email: "hello@snappinapp.com",
              logo: "https://www.snappinapp.com/images/snappin_dark_light.png",
              foundingDate: "2025",
              sameAs: [
                "https://twitter.com/maniikandan_p",
                "https://linkedin.com/company/snappinapp",
              ],
            }),
          }}
        />
        <MarketingProviders>{children}</MarketingProviders>
      </body>
    </html>
  );
}
