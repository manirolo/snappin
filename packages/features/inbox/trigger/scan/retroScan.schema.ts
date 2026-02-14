import z from "zod";

export const ZRetroScan = z.object({
    userId: z.string(),
    orgId: z.string(),
    integrationId: z.string(),
    startFrom: z.number(),
    endTo: z.number(),
})