import { cn } from "@snappin/ui/lib/utils";
import * as React from "react";

export const Section = ({
  children,
  className,
  setFullScreen = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { setFullScreen?: boolean }) => {
  return (
    <section
      className={cn(
        "py-12 md:py-18 max-w-6xl mx-auto flex flex-col gap-16 relative overflow-hidden",
        setFullScreen && "max-w-screen py-18 md:py-32",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
};

export const SectionHeader = ({
  children,
  className,
  align = "center",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { align?: "start" | "center" }) => {
  return (
    <div
      className={cn(
        "w-full max-w-3xl mx-auto px-4 xl:px-0 flex flex-col items-center text-center gap-4",
        align == "start" && "md:text-start md:items-start w-full max-w-7xl",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const gradients = [
  "from-blue-500 to-cyan-400",
  "from-orange-500 to-amber-400",
  "from-violet-500 to-fuchsia-400",
  "from-emerald-500 to-lime-400",
];

export const SectionLabel = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  const text = typeof children === "string" ? children : String(children);

  // Pick gradient based on content
  const gradient = gradients[text.length % gradients.length];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full text-sm font-semibold tracking-tight",
        "bg-linear-to-b bg-clip-text text-transparent",
        gradient,
        className,
      )}
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
      className={cn(
        "text-4xl/12 md:text-4xl/14 tracking-tighter text-fg-4/95 font-medium text-balance max-w-3xl",
        className,
      )}
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
      className={cn(
        "w-full max-w-md text-fg-2! text-base/7",
        className,
      )}
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
