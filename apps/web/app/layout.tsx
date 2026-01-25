import type { Metadata } from "next";
import "@snappin/ui/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { env } from "@snappin/env";
import { DM_Sans } from "next/font/google";
import { Providers } from "./provider";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Snappin | Your invoice extracted from emails automatically",
  description: "Connect your email and get your invoices extracted automatically with Snappin.",
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
        <body className={`${dmSans.variable} font-dm-sans`} suppressHydrationWarning>
            <Providers>
              {children}
            </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
