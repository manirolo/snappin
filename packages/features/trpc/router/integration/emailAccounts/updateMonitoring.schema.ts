import z from "zod";

export const ZUpdateMonitoringIntegration = z.object({
    integrationId: z.string(),
    disable: z.boolean()
})

export type TUpdateMonitoringIntegration = {
    integrationId: string
    disable: boolean
}