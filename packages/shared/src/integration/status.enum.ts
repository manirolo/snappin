import z from "zod";

export enum IntegrationStatus {
    IDLE = "idle",
    CONNECTED = "connected",
    REAUTH_REQUIRED = "reauth_required",
    PAUSED = "paused",
    ERROR = "error"
}

export const ZIntegrationStatus = z.enum(
    Object.values(IntegrationStatus) as [IntegrationStatus, ...IntegrationStatus[]]
)

export const statusLabel: Record<IntegrationStatus, { label: string; variant: "primary" | "warning" | "destructive" | "secondary" | "outline" }> = {
    [IntegrationStatus.IDLE]: { label: "Idle", variant: "secondary" },
    [IntegrationStatus.CONNECTED]: { label: "Connected", variant: "primary" },
    [IntegrationStatus.REAUTH_REQUIRED]: { label: "Need Authorization", variant: "warning" },
    [IntegrationStatus.PAUSED]: { label: "Paused", variant: "warning" },
    [IntegrationStatus.ERROR]: { label: "Error", variant: "destructive" },
}