import { z } from "zod";
import { ZVendor } from "../vendor/vendor.schema";
import { ZInvoiceExtractionRequest } from "../invoiceExtractRequest/invoiceExtractionRequest.schema";
import { AppSlug } from "../apps/app.schema";

export const ZPaymentStatus = z.enum([
    "paid",
    "unpaid",
    "partial",
    "refunded",
]);
export type PaymentStatus = z.infer<typeof ZPaymentStatus>;

export const ZPaymentMethod = z.enum([
    "cash",
    "check",
    "credit_card",
    "debit_card",
    "paypal",
    "bank_transfer",
    "upi",
    "other",
]);
export type PaymentMethod = z.infer<typeof ZPaymentMethod>;

export const ZPayment = z.object({
    status: ZPaymentStatus.nullable().optional(),
    method: ZPaymentMethod.nullable().optional(),
    terms: z.string().nullable().optional(),
    last4Digits: z.string().regex(/^\d{4}$/).nullable().optional(),
});
export type PaymentResource = z.infer<typeof ZPayment>;

export const ZInvoiceType = z.enum(["invoice", "receipt"]);
export type InvoiceType = z.infer<typeof ZInvoiceType>;

export const ZRecipient = z.object({
    name: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
    taxId: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
});
export type RecipientResource = z.infer<typeof ZRecipient>;

export const ZInvoiceSubscriptionFrequency = z.enum([
    "daily",
    "weekly",
    "monthly",
    "quarterly",
    "yearly",
]);

export const ZSubscription = z.object({
    isRecurring: z.boolean().nullable().optional(),
    frequency: ZInvoiceSubscriptionFrequency.nullable().optional(),
    nextBillingDate: z.string().nullable().optional(),
});
export type InvoiceSubscriptionResource = z.infer<typeof ZSubscription>;

export const ZTax = z.object({
    rate: z.number().nullable().optional(),
    amount: z.number().int().nullable().optional(),
});
export type TaxResource = z.infer<typeof ZTax>;

export const ZLineItem = z.object({
    description: z.string().nullable().optional(),
    quantity: z.number().nullable().optional(),
    unitPrice: z.number().int().nullable().optional(),
    discount: z.number().int().nullable().optional(),
    tax: ZTax.nullable().optional(),
    total: z.number().int().nullable().optional(),
});
export type LineItemsResource = z.infer<typeof ZLineItem>;

export const ZTotals = z.object({
    subtotal: z.number().int().nullable().optional(),
    discount: z.number().int().nullable().optional(),
    tax: ZTax.nullable().optional(),
    total: z.number().int().nullable().optional(),
    currency: z.string().regex(/^[A-Z]{3}$/).nullable().optional(),
});
export type TotalsResource = z.infer<typeof ZTotals>;

export const ZInvoiceMetadata = z.object({
    documentType: ZInvoiceType.default("invoice"),
    subscription: ZSubscription.nullable().optional(),
});
export type InvoiceMetadataResource = z.infer<typeof ZInvoiceMetadata>;

export const ZIntegrationExportMeta = z.object({
    appSlug: z.enum(AppSlug),                     
    integrationId: z.string(),                          
    exportedAt: z.number().nullable().optional(),
    externalId: z.string().nullable().optional(),
    url: z.string().nullable().optional(),
    syncedAt: z.number().nullable().optional(),
    error: z.string().nullable().optional(),
})
export type IntegrationExportMeta = z.infer<typeof ZIntegrationExportMeta>

// export const ZAttachment = z.object({
//   appSlug: z.enum(AppSlug),
//   fileId: z.string(),
//   fileName: z.string().nullable().optional(),
//   path: z.string().nullable().optional(),
//   isPrimary: z.boolean().default(false),
// });

export const ZInvoice = z.object({
    _id: z.string().optional(),

    userId: z.string(),
    orgId: z.string().nullable().optional(),

    /* identity */
    invoiceId: z.string().nullable().optional(),
    invoiceDate: z.string().nullable().optional(),
    dueDate: z.string().nullable().optional(),

    description: z.string().nullable().optional(),

    recipient: ZRecipient.nullable().optional(),

    totals: ZTotals.nullable().optional(),

    /* items */
    lineItems: z.array(ZLineItem).nullable().optional(),

    /* payment */
    payment: ZPayment.nullable().optional(),

    /* metadata */
    metadata: ZInvoiceMetadata,

    /* extraction reference */
    extractionId: z.string().nullable(),
    extraction: ZInvoiceExtractionRequest.optional().nullable(),

    /* relations */
    vendorId: z.string().nullable().optional(),
    vendor: ZVendor.optional().nullable(),
    
    integrations: z.array(ZIntegrationExportMeta).optional(),

    /* timestamps */
    createdAt: z.number().optional(),
    updatedAt: z.number().optional(),
});

export type InvoiceResource = z.infer<typeof ZInvoice>;