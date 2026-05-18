"use client";

import { usePostHog } from "posthog-js/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { IS_PRODUCTION } from "@snappin/env";
import { isRecordingDisabled } from "./init.client";

export function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ph = usePostHog();

  useEffect(() => {
    if (!pathname || !ph || !ph.__loaded) return;

    let url = window.origin + pathname;
    const search = searchParams.toString();
    if (search) url += `?${search}`;

    ph.capture("$pageview", { $current_url: url });

    if (isRecordingDisabled(pathname)) {
      ph.stopSessionRecording();
    } else if (IS_PRODUCTION) {
      ph.startSessionRecording();
    }
  }, [pathname, searchParams, ph]);

  return null;
}