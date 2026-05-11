import { useUsage } from "@snappin/features/billing/hooks/useUsage";
import { Button } from "@snappin/ui/components/button";
import { cn } from "@snappin/ui/lib/utils";
import { useRouter } from "next/navigation";
import * as React from "react";
import { HiStar } from "react-icons/hi";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@snappin/ui/components/accordion";

export const Tool = ({
  children,
  className,
  setFullScreen = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { setFullScreen?: boolean }) => {
  return (
    <div
      className={cn(
        "px-4 xl:px-0 py-8 md:py-12 max-w-6xl mx-auto flex flex-col gap-12 relative overflow-hidden",
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
        <span className={cn("font-fuzzy-bubbles!", gradient)}>{children}</span>
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
    <h1
      className={cn(
        "text-4xl/12 md:text-4xl/12 tracking-tighter text-fg-4/95 font-medium text-balance max-w-3xl",
        className,
      )}
      {...props}
    >
      {children}
    </h1>
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
    <div
      className={cn("px-4 xl:px-0 flex flex-col gap-3", className)}
      {...props}
    >
      {children}
    </div>
  );
};

const FEATURES = [
  {
    icon: "✉",
    label: "Email monitoring",
    className:
      "border-blue-200 bg-blue-50 bg-gradient-to-b from-blue-600 to-cyan-500",
  },
  {
    icon: "💬",
    label: "WhatsApp uploads",
    className:
      "border-green-200 bg-green-50 bg-gradient-to-b from-green-600 to-emerald-400",
  },
  {
    icon: "🌐",
    label: "Web portal extraction (Coming)",
    className:
      "border-purple-200 bg-purple-50 bg-gradient-to-b from-purple-600 to-pink-500",
  },
  {
    icon: "🔗",
    label: "Sync with Xero, Quickbooks",
    className:
      "border-red-200 bg-red-50 bg-gradient-to-b from-red-500 to-red-400",
  },
];

export const ToolAd = ({
  ctaHref = "/signup",
  className,
}: {
  ctaHref?: string;
  className?: string;
}) => {
  const router = useRouter();
  const { usage } = useUsage();

  return (
    <div
      className={cn(
        "relative flex flex-wrap max-w-4xl w-full min-h-[20vh] mx-auto justify-between gap-6 mt-8",
        "rounded-t-2xl border-2 border-b-0 border-border/60 border-dashed bg-background p-4",
        className,
      )}
    >
      <div className="flex flex-col gap-1">
        <span className="inline-flex w-fit items-center gap-1 text-xs text-fg-3 font-medium">
          You&#39;ve used {usage?.usage.invoices ?? 0} of{" "}
          {usage?.limits.invoices ?? 10} free conversions
        </span>

        <p
          className="text-2xl/7 tracking-tight mt-5 font-semibold
           bg-linear-to-b from-orange-500 to-yellow-400 bg-clip-text text-transparent"
        >
          Unlock unlimited extraction
        </p>
        <p className="text-sm/6 mt-0.5 text-muted-foreground">
          Pull email receipts automatically, upload via WhatsApp, and
          batch-process receipts automatically.
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          {FEATURES.map((f) => (
            <span
              key={f.label}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium text-fg-2",
              )}
            >
              {f.icon} {f.label}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center self-center gap-1.5">
        <Button onClick={() => router.push(ctaHref)}>Get started free</Button>
      </div>
      <svg
        className="absolute -bottom-2.75 left-0 w-full"
        height="12"
        viewBox="0 0 1200 12"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polyline
          points="0,0 15,12 30,0 45,12 60,0 75,12 90,0 105,12 120,0 135,12 150,0 165,12 180,0 195,12 210,0 225,12 240,0 255,12 270,0 285,12 300,0 315,12 330,0 345,12 360,0 375,12 390,0 405,12 420,0 435,12 450,0 465,12 480,0 495,12 510,0 525,12 540,0 555,12 570,0 585,12 600,0 615,12 630,0 645,12 660,0 675,12 690,0 705,12 720,0 735,12 750,0 765,12 780,0 795,12 810,0 825,12 840,0 855,12 870,0 885,12 900,0 915,12 930,0 945,12 960,0 975,12 990,0 1005,12 1020,0 1035,12 1050,0 1065,12 1080,0 1095,12 1110,0 1125,12 1140,0 1155,12 1170,0 1185,12 1200,0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-border"
          strokeDasharray="4 4"
        />
      </svg>
    </div>
  );
};

export const ToolInput = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "w-full max-w-4xl mx-auto flex flex-col gap-6 items-center",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const ToolOutput = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "w-full max-w-4xl mt-4 mx-auto flex flex-col gap-6 items-center",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const ToolBenefit = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "py-8 md:py-14 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center w-full",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const ToolBenefitItem = ({
  icon,
  title,
  description,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col max-w-xs items-center px-2 text-center",
        className,
      )}
      {...props}
    >
      <div className="size-14 flex items-center text-fg-3 bg-bg-2 rounded-full justify-center">
        {icon}
      </div>
      <p className="font-bold text-fg-4 mt-3">{title}</p>
      <p className="text-sm text-fg-2 mt-4 leading-relaxed">{description}</p>
    </div>
  );
};

export const ToolGuide = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "py-6 md:py-12 max-w-4xl mx-auto w-full flex flex-col gap-10",
        className,
      )}
      {...props}
    >
      <h2 className="text-4xl/12 md:text-4xl/14 tracking-tighter text-center text-fg-4/95 font-medium text-balance">How to use</h2>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
};

export const ToolGuideItem = ({
  step,
  title,
  description,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  step: number;
  title: string;
  description: React.ReactNode;
}) => {
  const gradient = gradients[step % gradients.length];

  return (
    <div
      className={cn(
        "flex items-center gap-4 max-w-md mx-auto px-4 py-5 rounded-2xl border border-bg-4 hover:shadow-[2px_3px_0px_var(--color-gray-4)] transition-all duration-300 bg-background",
        className,
      )}
      {...props}
    >
      {/* Step number */}
      <span
        className={cn(
          "shrink-0 size-9 rounded-full flex items-center justify-center text-sm font-bold bg-linear-to-b text-white",
          gradient,
        )}
      >
        {step}
      </span>

      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-fg-4 text-base">{title}</h3>
        <p className="text-sm text-fg-2 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

import Head from "next/head";

export const ToolFaq = ({
  items,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  items: { id: string; question: string; answer: string }[];
}) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </Head>

      <div
        className={cn(
          "py-6 md:py-12 max-w-4xl mx-auto w-full flex flex-col gap-10",
          className,
        )}
        {...props}
      >
        <h2 className="text-4xl/12 md:text-4xl/14 text-center tracking-tighter text-fg-4/95 font-medium text-balance">
          Frequently asked questions
        </h2>
        <div className="max-w-xl mx-auto w-full">
          <Accordion
            type="single"
            collapsible
            className="w-full shadow-none space-y-2"
          >
            {items.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="shadow-none border-0 px-4 rounded-lg"
              >
                <AccordionTrigger className="text-base h-10 flex items-center tracking-tight font-medium text-left hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-base font-normal tracking-tight leading-relaxed text-fg-3">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </>
  );
};

export const ToolReview = ({
  reviews,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  reviews: {
    id: string;
    name: string;
    rating: number;
    comment: string;
  }[];
}) => {
  return (
    <div
      className={cn(
        "py-6 md:py-12 max-w-4xl mx-auto w-full flex flex-col gap-10",
        className,
      )}
      {...props}
    >
      <h2 className="text-4xl/12 md:text-4xl/14 text-center tracking-tighter text-fg-4/95 font-medium text-balance">
        We love ❤️ our customers
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="flex flex-col gap-3 rounded-xl border border-border/60 bg-background p-4"
          >
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <HiStar
                  key={i}
                  className={cn(
                    "size-4",
                    i < review.rating ? "text-yellow-400" : "text-muted-foreground/30",
                  )}
                />
              ))}
            </div>

            <p className="text-sm/6 text-fg-2 leading-relaxed flex-1">
              {review.comment}
            </p>

            <div className="flex items-center gap-2 mt-1">
              <div className="size-7 rounded-full bg-bg-2 flex items-center justify-center text-xs font-semibold text-fg-3">
                {review.name.charAt(0)}
              </div>
              <span className="text-sm font-medium text-fg-3">{review.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
