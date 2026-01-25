import z from "zod";

export const ZUpdateIntegration = z.object({
    integrationId: z.string(),
    mailMonitored: z.boolean()
})

export type TUpdateIntegration = {
    integrationId: string
    mailMonitored: boolean
}