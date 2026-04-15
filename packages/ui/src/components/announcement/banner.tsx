"use client";

import { HiOutlineChevronRight } from "react-icons/hi";
import React from "react";
import Link from "next/link";

export function AnnouncementBanner({
  badgeLabel,
  children,
  href,
  setTarget_Bank = false,
}: {
  badgeLabel: string;
  children: React.ReactNode;
  href?: string;
  setTarget_Bank?: boolean 
}) {
  return (
    <Link
      href={href ?? "#"}
      target={setTarget_Bank ? "_blank" : "_self"}
      className="relative inline-flex items-center bg-green-a1 text-green-4 gap-2.5 rounded-full px-2 py-1 text-sm font-medium cursor-pointer overflow-hidden"
    >
      {/* Badge */}
      <span className="rounded-full bg-linear-to-r from-green-4 to-yellow-4 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
        {badgeLabel}
      </span>
      {children}
      <HiOutlineChevronRight />
    </Link>
  );
}
