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
    { path: "../public/fonts/OpenRunde-Regular.otf", weight: "400", style: "normal" },
    { path: "../public/fonts/OpenRunde-Medium.otf", weight: "500", style: "normal" },
    { path: "../public/fonts/OpenRunde-Semibold.otf", weight: "600", style: "normal" },
    { path: "../public/fonts/OpenRunde-Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-openrunde",
});

export const metadata: Metadata = {
  title: "Snappin",
  description:
    "Connect your email and get your invoices extracted automatically with Snappin.",
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
          <link rel="stylesheet" href="https://unpkg.com/lenis@1.3.21/dist/lenis.css"></link>
          <script
            defer
            data-website-id="dfid_h43Xwm7msTA9rQ207PzDm"
            data-domain="snappinapp.com"
            data-allow-localhost="true"
            src="https://datafa.st/js/script.js"
          ></script>
        </head>
        <body className={`${openrunde.variable} ${fuzzyBubbles.variable} ${inter.variable}`} suppressHydrationWarning>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
