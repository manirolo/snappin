"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.2 });

export function ProgressWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // ✅ Finish the bar whenever the route change completes
  useEffect(() => {
    NProgress.done();
  }, [pathname]);

  // ✅ Start the bar the moment any internal link is clicked
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");

      // Only intercept internal, same-origin links
      const isInternal =
        href &&
        !href.startsWith("http") &&
        !href.startsWith("mailto:") &&
        !href.startsWith("tel:") &&
        !target.hasAttribute("download") &&
        target.target !== "_blank";

      if (isInternal) {
        NProgress.start();
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return <>{children}</>;
}
