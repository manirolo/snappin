import { cn } from "@snappin/ui/lib/utils";
import * as React from "react";

export const Section = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("max-w-5xl mx-auto py-14", props.className)} {...props}>
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
      className="flex flex-col items-center text-center mb-12 px-4 xl:px-0"
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
      className="text-sm bg-gray-1 p-px mb-5 px-1.5 rounded-lg text-fg-1 tracking-tight font-normal"
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
      className={cn("text-4xl tracking-tight leading-11 font-medium text-fg-4 text-balance max-w-md", className)}
      {...props}
    >
      {children}
    </h2>
  );
};

export const SectionDescription = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => {
  return (
    <p
      className={cn("w-full max-w-sm text-center leading-relaxed mt-4 text-fg-2 tracking-tight font-medium", props.className)}
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
