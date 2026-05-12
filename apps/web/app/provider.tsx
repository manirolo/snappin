import React from "react"
import { ThemeProviders } from "@snappin/ui/components/theme";
import { TRPCProviders } from "../trpc/react/provider"
import { ProgressWrapper } from "../components/progress/provider";
import { Toaster } from "react-hot-toast"
import { GlobalConfirmDialog } from "@snappin/ui/components/alert/alert";
import { PostHogProvider } from "./posthog-provider";
import PostHogIdentify from "../components/posthogIdentity";
import { CrispLoader } from "../components/chat/crispLoader";

export function Providers({ children }: { children: React.ReactNode }) {
  
    return (
        <PostHogProvider>
            <ThemeProviders>
                <ProgressWrapper>
                    <TRPCProviders>
                        <CrispLoader />
                        <GlobalConfirmDialog />
                        <Toaster />
                        <PostHogIdentify />
                        {children}
                    </TRPCProviders>
                </ProgressWrapper>
            </ThemeProviders>
        </PostHogProvider>
    )
}