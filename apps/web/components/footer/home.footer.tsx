import { CDNImage } from "@snappin/ui/components/imagekit/image";
import { Small } from "@snappin/ui/components/typography";
import Link from "next/link";
import React from "react";

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Home", href: "/" },
      { label: "Pricing", href: "/pricing" },
      { label: "Login", href: "/login" },
      { label: "Register", href: "/signup" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      {
        label: "Affiliate",
        href: "https://snappin.lemonsqueezy.com/affiliates",
        external: true,
      },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Docs", href: "/docs" },
    ],
  },
  {
    title: "Developer",
    links: [
      {
        label: "Feedback",
        href: "http://snappinapp.userjot.com/",
        external: true,
      },
      {
        label: "Platform Status",
        href: "https://status.snappinapp.com/",
        external: true,
      },
    ],
  },
  {
    title: "Tools",
    links: [
      {
        label: "Receipt to Excel converter",
        href: "/tools/receipt-to-excel-converter",
      },
    ],
  },
];

export const HomeFooter = () => {
  return (
    <div className="h-[50vh]">
      <footer className="max-w-6xl h-fit mx-auto flex-col flex px-4 xl:px-0 pt-24 pb-32">
        <div className="flex flex-col min-w-full lg:flex-row gap-16 justify-between">
          {/* Brand blurb */}
          <div className="flex flex-col gap-4 max-w-sm shrink-0">
            <Small className="max-w-sm">
              Built over hundreds of late nights, Snappin saves you from
              invoice, receipts chaos and manual entry.
            </Small>
            <Small>Copyright © 2026 - All rights reserved</Small>
            <div className="flex items-center gap-2">
              <Small>Built with ☕ and 🥐 by</Small>
              <Link
                href={"https://www.linkedin.com/in/manikandanp23/"}
                target="_blank"
                className="flex items-center gap-2  group"
              >
               <Small className="underline">Mani</Small> 
                <CDNImage
                  imageClassName="rounded-full"
                  src="https://media.licdn.com/dms/image/v2/D5603AQHII_OaopkQow/profile-displayphoto-crop_800_800/B56ZlctQ3zKIAM-/0/1758196995035?e=1779926400&v=beta&t=Ls3OVv0nUQHKJXC1I7Bs5opRi0UJ_yUpwr78RJys0jU"
                  className="size-5 transition-all duration-300 group-hover:scale-110"
                  alt="Manikandan p snappin founder"
                />
              </Link>
            </div>
          </div>

          {/* Links */}
          <div className="flex max-w-2xl flex-wrap gap-x-12 gap-y-8">
            {footerLinks.map(({ title, links }) => (
              <div key={title} className="flex flex-col gap-2 min-w-fit">
                <Small className="text-fg-4">{title}</Small>
                <div className="flex flex-col gap-1">
                  {links.map(({ label, href, external }) => (
                    <Link
                      key={label}
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      className="text-fg-3 text-sm"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </footer>
      <div className="relative hidden md:inline h-[25vh] max-w-6xl mx-auto w-full overflow-hidden">
        <div className="text-center lg:-translate-y-5  xl:-translate-y-10 overflow-hidden">
          <span className="tracking-tighter font-semibold text-8xl mx-auto md:text-[12em] lg:text-[14em] xl:text-[19em] text-center bg-linear-to-b from-foreground/20 to-foreground/0 bg-clip-text text-transparent">
            Snappin
          </span>
        </div>
      </div>
    </div>
  );
};
