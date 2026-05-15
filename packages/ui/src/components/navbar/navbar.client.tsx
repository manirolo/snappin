"use client";

import { Button } from "../button";
import Link from "next/link";
import { Small } from "../typography";

export const DashboardOrLogin = () => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-6">
        <Link href={"/pricing"} className="flex md:hidden">
          <Small className="text-sm text-fg-3">Pricing</Small>
        </Link>
        <Link
          href={"/login"}
          className="text-fg-4 hidden md:flex text-sm"
        >
          Login
        </Link>
        <Button asChild className="text-[13px]/6">
          <Link href={"/signup"}>Get started</Link>
        </Button>
      </div>
    </div>
  );
};

export const NavigationLinks = () => {
  return (
    <div className="hidden md:flex gap-14">
      <Link href={"/pricing"}>
        <Small className="text-sm text-fg-4">Pricing</Small>
      </Link>
      <Link href={"/blog"}>
        <Small className="text-sm text-fg-4">Blog</Small>
      </Link>
    </div>
  );
};

export const MobileNavigation = () => {
  return <div></div>;
};
