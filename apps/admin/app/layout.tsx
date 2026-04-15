import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@snappin/ui/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { env } from "@snappin/env";
import { Providers } from "./provider";

export const metadata: Metadata = {
  title: "Snappin",
  description:
    "Connect your email and get your invoices extracted automatically with Snappin.",
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
        className={`${inter.variable} h-full antialiased`}
        suppressHydrationWarning
      >
        <body className="min-h-full flex flex-col" suppressHydrationWarning>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
