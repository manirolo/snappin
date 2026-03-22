import z from "zod";

export const ZExport = z.object({
    filters: z.object({
        vendorIds: z.array(z.string()).optional(),
        senderEmails: z.array(z.string()).optional(),
        recipientEmails: z.array(z.string()).optional(),
        currencies: z.array(z.string()).optional(),
        invoiceRecipients: z.array(z.string()).optional(),
    }).optional(),
    selectedIds: z.array(z.string()).optional()
})

export type TExport = z.infer<typeof ZExport>