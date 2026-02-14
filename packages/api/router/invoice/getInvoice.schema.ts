import { InvoiceResource } from "@snappin/shared/invoice/invoice.schema"
import z from "zod";

export const ZGetInvoices = z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10),
});

export type TGetInvoices = z.infer<typeof ZGetInvoices>

export type TGetInvoiceResponse = Omit<InvoiceResource, "attachments">