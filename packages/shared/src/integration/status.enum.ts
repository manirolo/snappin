import z from "zod";

export enum IntegrationStatus {
    CONNECTED = "connected",
    REAUTH_REQUIRED = "reauth_required",
    PAUSED = "paused",
    DISABLED = "disabled",
    ERROR = "error"
}

export const ZIntegrationStatus = z.enum(
    Object.values(IntegrationStatus) as [IntegrationStatus, ...IntegrationStatus[]]
)

export const statusLabel: Record<IntegrationStatus, { label: string; variant: "primary" | "warning" | "destructive" | "secondary" | "outline" }> = {
    [IntegrationStatus.CONNECTED]: { label: "Connected", variant: "primary" },
    [IntegrationStatus.REAUTH_REQUIRED]: { label: "Need Authorization", variant: "warning" },
    [IntegrationStatus.PAUSED]: { label: "Paused", variant: "secondary" },
    [IntegrationStatus.DISABLED]: { label: "Disabled", variant: "secondary" },
    [IntegrationStatus.ERROR]: { label: "Error", variant: "destructive" },
}