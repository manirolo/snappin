"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { LogoSymbol } from "../logo";
import { DashboardOrLogin, NavigationLinks } from "./navbar.client";

const NAV_LINKS = [
  { label: "Affiliate", href: "/https://snappin.lemonsqueezy.com/affiliates" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "Docs", href: "/docs" },
];

// ─── HomeNavbar ───────────────────────────────────────────────────────────────
// The hamburger and dropdown both live here so the dropdown can sit inside the
// same max-w-lg container and naturally stretch to the full navbar width.

export const HomeNavbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-20">
      <div className="fixed left-0 right-0 top-0 z-50 px-4 xl:px-0">
        <div className="relative max-w-xl w-full mx-auto mt-8">
          {/* ── Navbar pill ── */}
          <div className="flex z-40! items-center min-h-12 sm:min-h-13 bg-navbar text-white rounded-3xl gap-1 p-2 pl-3 pr-5 xl:px-3 justify-between">
            <LogoSymbol>Snappin</LogoSymbol>
            <NavigationLinks />

            <div className="flex gap-4 items-center">
              {/* Desktop auth */}
              <DashboardOrLogin />

              {/* Hamburger — mobile only */}
              <button
                aria-label={open ? "Close menu" : "Open menu"}
                onClick={() => setOpen((v) => !v)}
                className="xl:hidden flex flex-col justify-center items-center w-5 h-5 space-y-1 focus:outline-none"
              >
                <motion.span
                  animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="block h-0.5 shrink-0 w-5 bg-white/70 rounded-full origin-center"
                />
                <motion.span
                  animate={
                    open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }
                  }
                  transition={{ duration: 0.15 }}
                  className="block h-[1.1px] shrink-0 w-5 bg-white/70 rounded-full"
                />
                <motion.span
                  animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="block h-0.5 w-5 bg-white/70 rounded-full origin-center"
                />
              </button>
            </div>
          </div>
          {/* ── Dropdown — same width as the navbar pill above ── */}
          <AnimatePresence>
            {open && (
              <motion.div
                key="mobile-dropdown"
                initial={{ opacity: 0, scaleY: 0.92, y: 0 }}
                animate={{ opacity: 1, scaleY: 1, y: 0 }}
                exit={{ opacity: 0, scaleY: 0.92, y: 0 }}
                style={{ transformOrigin: "top center" }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="
                  absolute top-0 w-full pt-12 -z-10
                  bg-navbar border border-white/8
                  rounded-3xl overflow-hidden shadow-2xl
                  flex flex-col xl:hidden
                "
              >
                {/* Divider */}
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{
                    delay: 0.1,
                    duration: 0.25,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{ transformOrigin: "left" }}
                  className="h-px bg-white/[0.07] mx-4"
                />

                {/* Nav links */}
                <div className="flex flex-col py-2">
                  {NAV_LINKS.map((link, i) => (
                    <Link
                      key={i}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center px-4 py-2.5 text-white/70 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
