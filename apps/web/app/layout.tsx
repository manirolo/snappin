import type { Metadata, Viewport } from "next";
import "@snappin/ui/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { env } from "@snappin/env";
import { DM_Sans, Onest } from "next/font/google";
import { Providers } from "./provider";

const onest = Onest({
  subsets: ["latin"],
  variable: "--font-onest",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
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
      signInForceRedirectUrl={"/"}
      signUpForceRedirectUrl={"/"}
      signInUrl={env.clerk.signInUrl}
      signUpUrl={env.clerk.signUpUrl}
      afterSignOutUrl={"/login"}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${onest.variable} ${dmSans.variable} font-onest`}
          suppressHydrationWarning
        >
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}