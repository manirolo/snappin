import React from "react";
import { TRPCProviders } from "../../trpc/react/provider";
import { ProgressWrapper } from "../progress/provider";
import { Toaster } from "react-hot-toast";
import { GlobalConfirmDialog } from "@snappin/ui/components/alert/alert";
import PostHogIdentify from "../posthogIdentity";
import { CrispLoader } from "../chat/crispLoader";
import { PostHogProvider } from "../posthog/provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider>
      <ProgressWrapper>
        <TRPCProviders>
          <CrispLoader />
          <GlobalConfirmDialog />
          <Toaster />
          <PostHogIdentify />
          {children}
        </TRPCProviders>
      </ProgressWrapper>
    </PostHogProvider>
  );
}
