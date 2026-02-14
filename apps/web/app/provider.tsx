import React from "react"
import { ThemeProviders } from "@snappin/ui/components/theme";
import { TRPCProviders } from "@snappin/api/react/provider"
import { ProgressWrapper } from "../components/progress/provider";
import { Toaster } from "react-hot-toast"
import { GlobalConfirmDialog } from "@snappin/ui/components/alert/alert";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProviders>
            <ProgressWrapper>
                <TRPCProviders>
                    <GlobalConfirmDialog />
                    <Toaster />
                    {children}
                </TRPCProviders>
            </ProgressWrapper>
        </ThemeProviders>

    )
}