import type { Metadata, Viewport } from "next";
import "@snappin/ui/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { env } from "@snappin/env";
import { Fuzzy_Bubbles, Inter } from "next/font/google";
import { Providers } from "./provider";
import localFont from "next/font/local";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const fuzzyBubbles = Fuzzy_Bubbles({
  weight: ["400", "700"],
  variable: "--font-fuzzy-bubbles",
});

const openrunde = localFont({
  src: [
    {
      path: "../public/fonts/OpenRunde-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/OpenRunde-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/OpenRunde-Semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/OpenRunde-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-openrunde",
});

export const metadata: Metadata = {
  title: "AI Invoice and Receipt Organizer",
  description:
    "Turn hours of manual invoice work into seconds. Extract invoices from emails and send receipts via WhatsApp—instantly organized and ready to use.",

  metadataBase: new URL("https://snappinapp.com"),

  openGraph: {
    title: "Snappin",
    description:
      "AI-powered invoice & receipt automation. Extract from emails & WhatsApp.",
    url: "https://snappinapp.com",
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
    title: "Snappin",
    description:
      "AI-powered invoice & receipt automation from emails & WhatsApp.",
    images: ["/images/og.png"],
    creator: "@snappin_ai",
  },

  alternates: {
    canonical: "https://snappinapp.com",
  },

  keywords: ["ai", "bookkeeping", "snappin app", "invoice extraction"],

  applicationName: "Snappin",
  creator: "Snappin",
  publisher: "Snappin",
  generator: "Snappin",
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
          <script
            dangerouslySetInnerHTML={{
              __html: `window.lemonSqueezyAffiliateConfig = { store: "snappin" };`,
            }}
          />
          <script src="https://lmsqueezy.com/affiliate.js" defer />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "Snappin",
                url: "https://snappinapp.com",
              }),
            }}
          />

          {env.env == "production" && (
            <script
              defer
              src="https://cloud.umami.is/script.js"
              data-website-id="94baed4a-1510-4b34-8f86-30d1bfda676a"
            />
          )}
        </head>
        <body
          className={`${openrunde.variable} ${fuzzyBubbles.variable} ${inter.variable}`}
          suppressHydrationWarning
        >
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
