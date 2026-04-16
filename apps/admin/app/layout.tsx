import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@snappin/ui/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { env } from "@snappin/env";
import { Providers } from "./provider";
import localFont from "next/font/local";

export const metadata: Metadata = {
  title: "Snappin",
  description:
    "Connect your email and get your invoices extracted automatically with Snappin.",
  robots: {
    index: false,
    follow: false,
  },
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
      <html
        lang="en"
        className={`${openrunde.variable} ${inter.variable} h-full antialiased`}
        suppressHydrationWarning
      >
        <body className="min-h-full flex flex-col" suppressHydrationWarning>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
