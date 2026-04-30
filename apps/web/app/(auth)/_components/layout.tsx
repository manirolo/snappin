import { ExtraSmall } from "@snappin/ui/components/typography";
import Link from "next/link";
import React from "react";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="max-h-screen w-auto mx-auto flex justify-center">
      <div className="flex min-h-screen max-h-fit py-0 xl:py-20 2xl:py-0 max-w-md mx-auto flex-col items-center justify-center p-2">
        {children}

        <footer className="max-w-md text-center space-y-2 mt-8">
          <ExtraSmall className="text-sm">
            By continuing you agree to our{" "}
            <Link
              href={"/terms"}
              className="text-gray-11 transition-all duration-300 p-0.5 rounded-md"
            >
              Terms and conditions
            </Link>
          </ExtraSmall>

          <Link href={"mailto:mani@snappinapp.com"} className="text-sm text-muted-foreground mt-2">
            Need help?
          </Link>
        </footer>
      </div>
    </div>
  );
};
