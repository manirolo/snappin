"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.2 });

export function ProgressWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.start();
    const timeout = setTimeout(() => NProgress.done(), 300);
    return () => clearTimeout(timeout);
  }, [pathname]);

  return <>{children}</>;
}
