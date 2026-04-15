import z from "zod";

export const ZExportToStorage = z.object({
    invoiceId: z.string(),
    integrationId: z.string(),
})

export type TExportToStorage = z.infer<typeof ZExportToStorage>