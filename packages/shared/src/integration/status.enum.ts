import z from "zod";

export enum IntegrationStatus {
    ACTIVE = "active",
    TOKEN_EXPIRED = "token_expired",
    REAUTH_REQUIRED = "reauth_required",
    DISABLED = "disabled",
    ERROR = "error"
}

export const ZIntegrationStatus = z.enum(
    Object.values(IntegrationStatus) as [IntegrationStatus, ...IntegrationStatus[]]
)