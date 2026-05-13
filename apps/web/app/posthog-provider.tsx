"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { IS_PRODUCTION } from "@snappin/env";

const RECORDING_DISABLED_PATHS = [
  "/tools",
  "/privacy",
  "/terms"
];

function isRecordingDisabled(pathname: string): boolean {
  return RECORDING_DISABLED_PATHS.some((path) =>
    pathname === path || pathname.startsWith(path + "/")
  );
}

function afterIdle(cb: () => void, timeout = 4000) {
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(cb, { timeout });
  } else {
    setTimeout(cb, timeout);
  }
}

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ph = usePostHog();

  useEffect(() => {
    if (!pathname || !ph) return;

    let url = window.origin + pathname;
    const search = searchParams.toString();
    if (search) url += `?${search}`;
    ph.capture("$pageview", { $current_url: url });

    if (isRecordingDisabled(pathname)) {
      ph.stopSessionRecording();
    } else {
      if (IS_PRODUCTION && !ph.sessionRecordingStarted()) {
        ph.startSessionRecording();
      }
    }
  }, [pathname, searchParams, ph]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const init = () => {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        capture_pageview: false,
        capture_pageleave: true,
        disable_surveys: true,
        disable_session_recording: true,

        loaded: (ph) => {
          if (!IS_PRODUCTION) return;

          afterIdle(() => {
            if (!isRecordingDisabled(window.location.pathname)) {
              ph.startSessionRecording();
            }
          }, 5000);
        },
      });
    };

    if (document.readyState === "complete") {
      afterIdle(init);
    } else {
      window.addEventListener("load", () => afterIdle(init), { once: true });
    }
  }, []);

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PHProvider>
  );
}