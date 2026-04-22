import { ExtraSmall } from "@snappin/ui/components/typography";
import Link from "next/link";
import React from "react";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="max-h-screen w-auto mx-auto flex justify-center">
      <div className="flex min-h-[95vh] max-w-md mx-auto flex-col items-center justify-center p-2">
        {children}

        <footer className="max-w-md text-center mt-8">
          <ExtraSmall className="text-sm">
            By signing up you agree to our{" "}
            <Link
              href={"/terms"}
              className="font-medium text-gray-11 transition-all duration-300 hover:bg-gray-2 p-0.5 rounded-md"
            >
              Terms and conditions
            </Link>{" "}
            and{" "}
            <Link
              href={"/privacy"}
              className="font-medium text-gray-11 transition-all duration-300 hover:bg-gray-2 p-0.5 rounded-md"
            >
              Privacy policy
            </Link>
          </ExtraSmall>

          <ExtraSmall className="text-xs text-muted-foreground mt-2">
            © {new Date().getFullYear()} Snappin
          </ExtraSmall>
        </footer>
      </div>
    </div>
  );
};
