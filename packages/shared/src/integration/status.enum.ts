import z from "zod";

export enum IntegrationStatus {
    ACTIVE = "active",
    EXPIRED = "expired"
}

export const ZIntegrationStatus = z.enum(
    Object.values(IntegrationStatus) as [IntegrationStatus, ...IntegrationStatus[]]
)