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
        label: "Affiliate (10%)",
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
  // {
  //   title: "Tools",
  //   links: [
  //     {
  //       label: "Receipt to Excel converter",
  //       href: "/tools/ai-receipt-converter",
  //     },
  //   ],
  // },
];

export const HomeFooter = () => {
  return (
    <div>
      <footer className="max-w-7xl mx-auto px-4 xl:px-0 pt-24 pb-32">
        <div className="flex flex-col lg:flex-row gap-16 justify-between">
          {/* Brand blurb */}
          <div className="flex flex-col gap-4 max-w-sm shrink-0">
            <Small className="max-w-sm">
              Built over hundreds of late nights, Snappin App saves you from
              invoice, receipts chaos and manual entry.
            </Small>
            <Small>Built with ☕ in INDIA</Small>
            <Small>© 2026</Small>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-x-12 gap-y-8">
            {footerLinks.map(({ title, links }) => (
              <div key={title} className="flex flex-col gap-2 min-w-max">
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
    </div>
  );
};
