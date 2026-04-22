import { cn } from "@snappin/ui/lib/utils";
import * as React from "react";

export const Section = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("py-12 md:py-18 max-w-5xl mx-auto flex flex-col gap-12 relative overflow-hidden", className)} {...props}>
      {children}
    </div>
  );
};

export const SectionHeader = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className="w-full max-w-3xl mx-auto px-4 xl:px-0 flex flex-col items-center text-center gap-4"
      {...props}
    >
      {children}
    </div>
  );
};

export const SectionLabel = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <span
      className="text-sm text-fg-1 tracking-normal font-normal"
      {...props}
    >
      {children}
    </span>
  );
};

export const SectionTitle = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <h2
      className={cn("text-4xl tracking-tighter text-fg-4 leading-tight font-semibold text-balance max-w-2xl", className)}
      {...props}
    >
      {children}
    </h2>
  );
};

export const SectionDescription = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => {
  return (
    <p
      className={cn("w-full max-w-md font-medium text-fg-1! text-base/7", className)}
      {...props}
    >
      {children}
    </p>
  );
};

export const SectionContent = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("px-4 xl:px-0", className)} {...props}>
      {children}
    </div>
  );
};
