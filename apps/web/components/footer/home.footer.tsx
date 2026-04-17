import { Small } from "@snappin/ui/components/typography";
import Link from "next/link";
import React from "react";

export const HomeFooter = () => {
  return (
    <div className="">
      <footer className="max-w-5xl mx-auto flex flex-wrap gap-14 px-4 xl:px-0 justify-between pt-24 pb-32">
        <div className="flex flex-col gap-4">
          <Small className="max-w-sm">
            Built over hundreds of late nights, Snappin saves you from invoice
            chaos and manual entry.
          </Small>
          <Small>© 2026</Small>
        </div>
        <div className="flex gap-18 flex-wrap">
          <div className="flex flex-col gap-2">
            <Small className="text-fg-4">Product</Small>
            <div className="flex flex-col gap-1">
              <Link href={"/"} className="text-fg-3 text-sm">
                Home
              </Link>
              <Link href={"/pricing"} className="text-fg-3 text-sm">
                Pricing
              </Link>
              <Link href={"/login"} className="text-fg-3 text-sm">
                Login
              </Link>
              <Link href={"/signup"} className="text-fg-3 text-sm">
                Register
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Small className="text-fg-4">Company</Small>
            <div className="flex flex-col gap-1">
              <Link href={"/blog"} className="text-fg-3 text-sm">
                Blog
              </Link>
              <Link href={"/contact"} className="text-fg-3 text-sm">
                Contact
              </Link>
              <Link href={"/privacy"} className="text-fg-3 text-sm">
                Privacy
              </Link>
              <Link href={"/terms"} className="text-fg-3 text-sm">
                Terms
              </Link>
              <Link href={"https://snappin.lemonsqueezy.com/affiliates"} target="_blank" className="text-fg-3 text-sm">
                Affiliate (20%)
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Small className="text-fg-4">Developer</Small>
            <div className="flex flex-col gap-1">
              <Link href={"http://snappinapp.userjot.com/"} target="_blank" className="text-fg-3 text-sm">
                Feedback
              </Link>
              <Link href={"https://status.snappinapp.com/"} target="_blank" className="text-fg-3 text-sm">
                Platform Status
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
