"use client";

import { PostHogProvider as PHProvider } from "posthog-js/react";
import { Suspense } from "react";
import posthog from "posthog-js";
import { PostHogInit } from "./init.client";
import { PostHogPageView } from "./pageview.client";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <PHProvider client={posthog}>
      <PostHogInit />
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </PHProvider>
  );
}