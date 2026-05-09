"use client";

import React, { useEffect, useState } from "react";
import { cn } from "../lib/utils";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";

export const Logo = ({
  className,
  onClickRedirectLink,
  darkLogo,
}: {
  className?: string;
  darkLogo?: boolean;
  onClickRedirectLink?: string;
}) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Before mount, render a placeholder with the same dimensions to avoid layout shift.
  // This ensures SSR and the initial client render output identical HTML.
  if (!mounted) {
    return (
      <div className="">
        <div
          className={cn("relative inline-block shrink-0 w-28 h-8", className)}
        />
      </div>
    );
  }

  return (
    <div className="relative">
      <Link
        href={onClickRedirectLink || "/"}
        className={cn("relative inline-block shrink-0 w-28 h-8", className)}
      >
        <Image
          src={
            resolvedTheme === "dark" || darkLogo
              ? "/images/snappin_logo_light.png"
              : "/images/snappin_dark_light.png"
          }
          fill
          className="object-contain"
          alt="Snappin"
        />
      </Link>
    </div>
  );
};
export const LogoSymbol = ({
  className,
  onClickRedirectLink,
  divClassName,
  children,
}: {
  className?: string;
  onClickRedirectLink?: string;
  divClassName?: string;
  children?: React.ReactNode;
}) => (
  <Link
    href={onClickRedirectLink || "/"}
    className={cn(
      "flex items-center gap-1.5 text-lg font-medium tracking-tight cursor-pointer",
      className,
    )}
  >
    <div className={cn("relative shrink-0 size-6.5 inline-block", divClassName)}>
      <Image
        src={"/images/favicon.png"}
        fill
        className="object-contain"
        alt="Snappin"
      />
    </div>
    {children && <span className="text-base">{children}</span>}
  </Link>
);
