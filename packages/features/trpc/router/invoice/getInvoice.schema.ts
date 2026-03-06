import { InvoiceResource } from "@snappin/shared/invoice/invoice.schema"
import z from "zod";

export const ZGetInvoices = z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10),
    filters: z.object({
        vendorIds: z.array(z.string()).optional(),
        senderEmails: z.array(z.string()).optional(),
        recipientEmails: z.array(z.string()).optional(),
        currencies: z.array(z.string()).optional(),        
        invoiceRecipients: z.array(z.string()).optional(),
    }).optional(),
});

export type TGetInvoices = z.infer<typeof ZGetInvoices>

export type TGetInvoiceResponse = Omit<InvoiceResource, "attachments">