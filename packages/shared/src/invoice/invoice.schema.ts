import { z } from "zod";
import { AppSlug } from "../apps/app.schema";
import { ZVendor } from "./vendor.schema";
import { ZInvoiceExtractionRequest } from "./invoiceExtractionRequest.schema";

export const ZPaymentStatus = z.enum([
    "paid",
    "unpaid",
    "partial",
    "refunded",
]);
export type PaymentStatus = z.infer<typeof ZPaymentStatus>;
export const ZInvoiceType = z.enum([
    "invoice",
    "receipt"
]);
export type InvoiceType = z.infer<typeof ZInvoiceType>;
export const ZRecipient = z.object({
    name: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    emailId: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
    state: z.string().nullable().optional(),
    country: z.string().nullable().optional(),
    zipCode: z.string().nullable().optional(),
})
export type RecipientResource = z.infer<typeof ZRecipient>;
export const ZInvoiceSubscriptionFrequency = z.enum(['day', 'weekly', 'monthly', 'yearly'])
export const ZSubscription = z.object({
    frequency: ZInvoiceSubscriptionFrequency.nullable().optional(),
    isRecurring: z.boolean().nullable().optional(),
    nextBillingDate: z.string().nullable().optional(),
})
export type InvoiceSubscriptionResource = z.infer<typeof ZSubscription>
export type LineItemsResource = z.infer<typeof ZLineItem>;
export const ZTax = z.object({
    taxCode: z.string().nullable().optional(),
    taxType: z.string().nullable().optional(),
    taxRate: z.number().nullable().optional(),
    taxAmount: z.number().nullable().optional(),
})
export type TaxResource = z.infer<typeof ZTax>;
export const ZPayment = z.object({
    status: ZPaymentStatus.nullable().optional(),
    paymentTerms: z.string().nullable().optional(),
    paymentMethod: z.string().nullable().optional(),
    paymentDate: z.string().nullable().optional(),
    paymentDueDate: z.string().nullable().optional(),
    transactionId: z.string().nullable().optional(),
    last4digit: z.number().nullable().optional(),
})
export type PaymentResource = z.infer<typeof ZPayment>;
export const ZLineItem = z.object({
    item: z.string().nullable().optional(),
    code: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    quantity: z.number().nullable().optional(),
    unitPrice: z.number().nullable().optional(),
    subTotal: z.number().nullable().optional(),
    total: z.number().nullable().optional(),
    tax: ZTax.nullable().optional(),
    discount: z.string().nullable().optional(),
})
export const ZInvoiceDocument = z.object({
    invoiceId: z.string().nullable().optional(),
    invoiceDate: z.string().nullable().optional(),
    dueDate: z.string().nullable().optional(),

    description: z.string().nullable().optional(),
    recipient: ZRecipient.nullable().optional(),
    vendorId: z.string().nullable().optional(),

    subTotal: z.number().nullable().optional(),
    tax: ZTax.nullable().optional(),
    total: z.number().nullable().optional(),
    currency: z.string().nullable().optional(),

    lineItems: z.array(ZLineItem).nullable().optional(),
    payment: ZPayment.nullable().optional(),

    metadata: z.object({
        subscription: ZSubscription.nullable().optional(),
        documentType: ZInvoiceType.default("invoice"),
    })
})
export type InvoiceDocumentResource = z.infer<typeof ZInvoiceDocument>;
export const ZAttachment = z.object({
    appSlug: z.enum(AppSlug),
    fileId: z.string(),
    fileName: z.string().nullable().optional(),
    path: z.string().nullable().optional(),
    isPrimary: z.boolean().default(false),
})
export const ZInvoice = z.object({
    _id: z.string().optional(),
    userId: z.string(),
    orgId: z.string().nullable().optional(),

    invoiceId: z.string().nullable().optional(),
    invoiceDate: z.string().nullable().optional(),
    dueDate: z.string().nullable().optional(),

    description: z.string().nullable().optional(),
    recipient: ZRecipient.nullable().optional(),
    
    subTotal: z.number().nullable().optional(),
    tax: ZTax.nullable().optional(),
    total: z.number().nullable().optional(),
    currency: z.string().nullable().optional(),
    
    lineItems: z.array(ZLineItem).nullable().optional(),
    payment: ZPayment.nullable().optional(),

    metadata: z.object({
        subscription: ZSubscription.nullable().optional(),
        documentType: ZInvoiceType.default("invoice"),
    }),
    
    attachments: z.array(ZAttachment).optional().nullable(),
    
    vendorId: z.string().nullable().optional(),
    vendor: ZVendor.optional().nullable(),
    extractionId: z.string().nullable(),
    extraction: ZInvoiceExtractionRequest.optional().nullable(),

    createdAt: z.number().optional(),
    updatedAt: z.number().optional(),
})

export type InvoiceResource = z.infer<typeof ZInvoice>;
