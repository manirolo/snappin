import { ZInvoice, ZInvoiceDocument } from "@snappin/shared/invoice/invoice.schema";
import { z } from "zod";


export const ZUpdateInvoice = z.object({
  invoiceId: z.string(),
  data: ZInvoice.partial().extend({
    invoiceId: z.string().optional(),
    invoiceDate: z.string().optional().nullable(),
    dueDate: z.string().optional().nullable(),
    currency: z.string().optional().nullable(),
    subTotal: z.number().optional().nullable(),
    total: z.number().optional().nullable(),
    tax: ZInvoiceDocument.shape.tax.unwrap().unwrap().partial().optional().nullable(),
    payment: ZInvoiceDocument.shape.payment.unwrap().unwrap().partial().optional().nullable(),
    recipient: ZInvoiceDocument.shape.recipient.unwrap().unwrap().partial().optional().nullable(),
    metadata: ZInvoiceDocument.shape.metadata.partial().optional(),
    lineItems: ZInvoiceDocument.shape.lineItems.optional().nullable(),
  }),
});

export type TUpdateInvoice = z.infer<typeof ZUpdateInvoice>;