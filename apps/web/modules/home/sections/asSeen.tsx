import React from "react";
import { CDNImage } from "@snappin/ui/components/imagekit/image";

const LOGOS = [
  {
    src: "/static/images/landing/logos/xero.webp",
    alt: "xero logo",
    className: "size-7",
  },
  {
    src: "/static/images/landing/logos/intuit%20quickbooks.webp",
    alt: "quickbooks logo",
    className: "w-24",
  },
  {
    src: "/static/images/landing/logos/product%20hunt.webp",
    alt: "product hunt logo",
    className: "w-28",
  },
  {
    src: "/static/images/landing/logos/toolify.webp",
    alt: "toolify logo",
    className: "w-24",
  },
  {
    src: "/static/images/landing/logos/theres%20an%20ai%20for%20that.webp",
    alt: "there is an ai for that logo",
    className: "w-46",
  },
];

export const AsSeen = () => {
  return (
    <div className="relative xl:px-0">
      <div className="pb-8 pt-8 flex flex-col md:flex-row max-w-6xl mx-auto text-center items-center gap-10">
        <div className="w-fit inline">
          <span className="text-fg-2 text-sm whitespace-nowrap">As seen</span>
        </div>
        <div className="relative w-full overflow-hidden mask-[linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <div className="flex w-max animate-marquee gap-16 hover:paused">
            {/* Render twice for seamless loop */}
            {[...LOGOS, ...LOGOS].map(({ src, alt, className }, i) => (
              <CDNImage
                key={i}
                src={src}
                imageClassName={`${className} opacity-40 hover:opacity-100 transition-all`}
                alt={alt}
                priority
                fetchPriority="high"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
