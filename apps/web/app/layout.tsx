import type { Metadata, Viewport } from "next";
import "@snappin/ui/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { env } from "@snappin/env";
import {
  Fuzzy_Bubbles,
  Stack_Sans_Text,
  Arapey,
  Barlow_Condensed,
} from "next/font/google";
import { Providers } from "./provider";
import Script from "next/script";

const inter = Stack_Sans_Text({
  subsets: ["latin"],
  variable: "--font-stacks",
  adjustFontFallback: false, // ← silences the warning
  fallback: ["system-ui", "Arial", "sans-serif"],
});

const phudu = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-barlow",
});

const source = Arapey({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-source",
});

const fuzzyBubbles = Fuzzy_Bubbles({
  weight: ["400", "700"],
  variable: "--font-fuzzy-bubbles",
});

export const metadata: Metadata = {
  title: "Snappin App – AI Receipt Organizer",
  description:
    "Turn hours of manual receipt collection and organizing work into seconds. Extract receipts from emails and send receipts via WhatsApp—instantly organized and ready to use.",

  metadataBase: new URL("https://www.snappinapp.com"),

  openGraph: {
    title: "Snappin App – AI Receipt Organizer",
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
    title: "Snappin App – AI Receipt Organizer",
    description:
      "AI-powered receipt collection automation from emails & WhatsApp.",
    images: ["/images/og.png"],
    creator: "@snappin_ai",
  },

  alternates: {
    canonical: "https://www.snappinapp.com",
  },

  keywords: ["ai", "bookkeeping", "snappin app", "receipt extraction"],

  applicationName: "Snappin App",
  creator: "Snappin App",
  publisher: "Snappin App",
  generator: "Snappin App",
  robots: {
    index: env.env == "production" ? true : false,
    follow: env.env == "production" ? true : false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      publishableKey={env.clerk.publishableKey}
      signInForceRedirectUrl={"/dashboard"}
      signUpForceRedirectUrl={"/dashboard"}
      signInUrl={env.clerk.signInUrl}
      signUpUrl={env.clerk.signUpUrl}
      afterSignOutUrl={"/login"}
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          <link
            rel="stylesheet"
            href="https://unpkg.com/lenis@1.3.21/dist/lenis.css"
          ></link>
          <Script id="lemon-squeezy-config" strategy="beforeInteractive">
            {`window.lemonSqueezyAffiliateConfig = { store: "snappin" };`}
          </Script>
          <Script
            src="https://lmsqueezy.com/affiliate.js"
            strategy="afterInteractive"
          />
          {env.env === "production" && (
            <Script
              src="https://cloud.umami.is/script.js"
              data-website-id="94baed4a-1510-4b34-8f86-30d1bfda676a"
              strategy="afterInteractive"
            />
          )}
        </head>
        <body
          className={`${phudu.variable} ${source.variable} ${fuzzyBubbles.variable} ${inter.variable}`}
          suppressHydrationWarning
        >
          <Script
            id="schema-org"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "Snappin App",
                alternateName: ["Snappin AI", "Snappin App"],
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
                name: "Snappin App",
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
                name: "Snappin App",
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
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
