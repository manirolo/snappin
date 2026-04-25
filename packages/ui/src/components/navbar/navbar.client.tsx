"use client";

import { Button } from "../button";
import Link from "next/link";
import { Small } from "../typography";

export const DashboardOrLogin = () => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Button variant={"inverse"} radius={"full"} asChild>
          <Link href={"/login"} className="rounded-[22px] text-fg-3 hover:underline">
            Login
          </Link>
        </Button>
        <Button radius={"full"} className="rounded-2xl" asChild>
          <Link href={"/signup"}>Register</Link>
        </Button>
      </div>
    </div>
  );
};

export const NavigationLinks = () => {
  return (
    <div className="hidden xl:flex gap-12">
      <Link href={"https://snappin.lemonsqueezy.com/affiliates"} target="_blank">
        <Small className="text-fg-3 hover:underline">Affiliate</Small>
      </Link>
      <Link href={"/pricing"}>
        <Small className="text-fg-3 hover:underline">Pricing</Small>
      </Link>
      <Link href={"/blog"}>
        <Small className="text-fg-3 hover:underline">Blog</Small>
      </Link>
      <Link href={"/docs"}>
        <Small className="text-fg-3 hover:underline">Docs</Small>
      </Link>
    </div>
  );
};

export const MobileNavigation = () => {
  return <div></div>;
};
