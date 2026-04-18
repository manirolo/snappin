import React from "react"
import { ThemeProviders } from "@snappin/ui/components/theme";
import { TRPCProviders } from "../trpc/react/provider"
import { ProgressWrapper } from "../components/progress/provider";
import { Toaster } from "react-hot-toast"
import { GlobalConfirmDialog } from "@snappin/ui/components/alert/alert";
import { PostHogProvider } from "./posthog-provider";
import PostHogIdentify from "../components/posthogIdentity";
import dynamic from 'next/dynamic'

export function Providers({ children }: { children: React.ReactNode }) {
  const CrispWithNoSSR = dynamic(() => import("../components/chat/crisp"));
  
    return (
        <PostHogProvider>
            <ThemeProviders>
                <ProgressWrapper>
                    <TRPCProviders>
                        <CrispWithNoSSR />
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