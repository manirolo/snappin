"use client";

import { Button } from "../button";
import Link from "next/link";
import { Small } from "../typography";

export const DashboardOrLogin = () => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Button variant={"inverse"} radius={"full"} asChild>
          <Link href={"/login"} className="rounded-[22px] text-white/70">
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
    <div className="hidden xl:flex gap-6">
      <Link href={"https://snappin.lemonsqueezy.com/affiliates"}>
        <Small className="text-white/70 hover:text-fg-1">Affiliate</Small>
      </Link>
      <Link href={"/pricing"}>
        <Small className="text-white/70 hover:text-fg-1">Pricing</Small>
      </Link>
      <Link href={"/blog"}>
        <Small className="text-white/70 hover:text-fg-1">Blog</Small>
      </Link>
    </div>
  );
};
