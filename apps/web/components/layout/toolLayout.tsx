import { cn } from "@snappin/ui/lib/utils";
import * as React from "react";
import { HiStar } from "react-icons/hi";

export const Tool = ({
  children,
  className,
  setFullScreen = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { setFullScreen?: boolean }) => {
  return (
    <div
      className={cn(
        "py-14 md:py-18 max-w-6xl mx-auto flex flex-col gap-12 relative overflow-hidden",
        setFullScreen && "max-w-screen py-18 md:py-32",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const ToolHeader = ({
  children,
  className,
  align = "center",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { align?: "start" | "center" }) => {
  return (
    <div
      className={cn(
        "w-full max-w-3xl mx-auto px-4 xl:px-0 flex flex-col items-center text-center gap-2",
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

export const ToolLabel = ({
  children,
  className,
  rating,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { rating?: number }) => {
  const text = typeof children === "string" ? children : String(children);
  const gradient = gradients[text.length % gradients.length];

  return (
    <div className="inline-flex items-center gap-1">
      <span
        className={cn(
          "inline-flex items-center rounded-full border border-white/10 bg-white/5 text-sm font-semibold tracking-tight",
          className,
        )}
        {...props}
      >
        <span
          className={cn(
            "bg-linear-to-b bg-clip-text text-transparent",
            gradient,
          )}
        >
          {children}
        </span>
      </span>

      {rating && (
        <div className="flex items-center gap-0.5">
          <HiStar className="text-yellow-400 size-4" />
          <span className="text-sm font-semibold">{rating}</span>
        </div>
      )}
    </div>
  );
};

// Usage
<ToolLabel rating={4.5}>Free tool</ToolLabel>;

export const ToolTitle = ({
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

export const ToolDescription = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => {
  return (
    <p
      className={cn(
        "w-full max-w-md font-normal opacity-90 text-fg-2! text-base/7",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
};

export const ToolContent = ({
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
