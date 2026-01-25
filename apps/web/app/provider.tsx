import React from "react"
import { ThemeProviders } from "@snappin/ui/components/theme";
import { TRPCProviders } from "@snappin/api/react/provider"
import { ProgressWrapper } from "../components/progress/provider";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProviders>
            <ProgressWrapper>
                <TRPCProviders>
                    {children}
                </TRPCProviders>
            </ProgressWrapper>
        </ThemeProviders>

    )
}