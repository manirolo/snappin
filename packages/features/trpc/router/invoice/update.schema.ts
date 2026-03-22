import { ZInvoice } from "@snappin/shared/invoice/invoice.schema";
import { z } from "zod";


export const ZUpdateInvoice = z.object({
  invoiceId: z.string(),
  data: ZInvoice.partial().extend({
    invoiceId: z.string().optional(),
    invoiceDate: z.string().optional().nullable(),
    dueDate: z.string().optional().nullable(),
    totals: ZInvoice.shape.totals.unwrap().unwrap().partial().optional().nullable(),
    payment: ZInvoice.shape.payment.unwrap().unwrap().partial().optional().nullable(),
    recipient: ZInvoice.shape.recipient.unwrap().unwrap().partial().optional().nullable(),
    metadata: ZInvoice.shape.metadata.partial().optional(),
    lineItems: ZInvoice.shape.lineItems.optional().nullable(),
  }),
});

export type TUpdateInvoice = z.infer<typeof ZUpdateInvoice>;