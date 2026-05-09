import { Avatar, AvatarFallback } from "@snappin/ui/components/avatar";
import { LogoSymbol } from "@snappin/ui/components/logo";
import { DotPattern } from "@snappin/ui/components/magicui/dot-pattern";
import { ExtraSmall } from "@snappin/ui/components/typography";
import Link from "next/link";
import React from "react";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="relative hidden xl:flex h-screen lg:w-3xl 2xl:w-5xl">
        <div className="relative h-full w-full bg-green-950 flex flex-col p-8 items-start justify-center overflow-hidden">
          <DotPattern
            cr={1}
            cx={20}
            cy={20}
            className="[&_circle]:fill-green-a1"
          />
          <div className="absolute top-10 left-10">
            <div>
              <LogoSymbol divClassName="size-10"></LogoSymbol>
            </div>
          </div>
          <div className="max-w-xl bg-green-a1 rounded-sm p-6 gap-4 mx-auto w-full text-start flex flex-col items-start">
            <div className="space-y-4">
              <h2 className="text-white/50 text-base/7 font-normal">
                Huge time saver. Connected Outlook and WhatsApp, and all my
                receipts synced to Xero in minutes.
              </h2>
              <div className="flex items-center gap-2">
                <Avatar className="size-9">
                  <AvatarFallback className="bg-green-a2 text-green-a4/50">S</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-white/50 text-sm">Simon</p>
                  <span className="text-white/30 text-sm">Finance Manager</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 w-full flex-col items-center justify-center h-screen overflow-y-auto px-4">
        <div className="w-fit mx-auto">{children}</div>

        <footer className="w-full max-w-md text-center space-y-2 mt-8">
          <ExtraSmall className="text-sm">
            By continuing you agree to our{" "}
            <Link
              href="/terms"
              className="text-gray-11 transition-all duration-300 p-0.5 rounded-md"
            >
              Terms and conditions
            </Link>
          </ExtraSmall>

          <Link
            href="mailto:mani@snappinapp.com"
            className="text-sm text-muted-foreground mt-2"
          >
            Need help?
          </Link>
        </footer>
      </div>
    </div>
  );
};
