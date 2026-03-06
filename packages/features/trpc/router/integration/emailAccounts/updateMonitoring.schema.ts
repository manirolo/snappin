import z from "zod";

export const ZUpdateMonitoringIntegration = z.object({
    integrationId: z.string(),
    mailMonitored: z.boolean()
})

export type TUpdateMonitoringIntegration = {
    integrationId: string
    mailMonitored: boolean
}