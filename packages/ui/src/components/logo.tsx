import React from "react";
import { cn } from "../lib/utils";
import Link from "next/link";
import Image from "next/image";

export const Logo = ({
  className,
  onClickRedirectLink,
}: {
  className?: string;
  darkLogo?: boolean;
  onClickRedirectLink?: string;
}) => {
  const src = "/images/snappin_dark_light.png";

  return (
    <Link
      href={onClickRedirectLink || "/"}
      aria-label="Snappin – Go to homepage"
      className={cn("relative inline-block shrink-0 w-28 h-8", className)}
    >
      <Image
        src={src}
        alt="Snappin"
        fill
        className="object-contain"
        priority
        sizes="112px"
      />
    </Link>
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
    <div
      className={cn("relative shrink-0 size-6.5 inline-block", divClassName)}
    >
      <Image
        fill
        src="/images/favicon.png"
        className="object-contain"
        alt=""
        priority
        fetchPriority="high"
      />
    </div>
    {children ? <span className="text-base">{children}</span> : null}
  </Link>
);
