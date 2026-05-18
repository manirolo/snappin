import React from "react";
import { TRPCProviders } from "../../trpc/react/provider";
import { ProgressWrapper } from "../progress/provider";
import { PostHogProvider } from "../../app/posthog-provider";
import PostHogIdentify from "../posthogIdentity";
import { CrispLoader } from "../chat/crispLoader";
import { ClerkShell } from "./clerk-shell";

export function ToolsProviders({ children }: { children: React.ReactNode }) {
  return (
    <ClerkShell>
      <PostHogProvider>
        <ProgressWrapper>
          <TRPCProviders>
            <CrispLoader />
            <PostHogIdentify />
            {children}
          </TRPCProviders>
        </ProgressWrapper>
      </PostHogProvider>
    </ClerkShell>
  );
}
