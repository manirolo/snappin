import { z } from "zod";
import { AppCategory, AppSlug } from "../apps/app.enum";
import { ZVendor } from "./vendor.schema";
import { ZMail } from "../inbox/mail.schema";

export enum TOCREngine {
    AWS_TEXTRACT = "aws-textract",
    GOOGLE_DOCUMENT_AI = "google-document-ai",
}
export const ZOCREngine = z.enum(TOCREngine);

export enum AnalyzeEngine {
    GEMINI = "gemini",
    TEXTRACT = "textract",
}
export const ZAnalyzeEngine = z.enum(AnalyzeEngine);

export const ZExtractionStatus = z.enum([
    "not_started",
    "success",
    "failed",
]);
export type ExtractionStatus = z.infer<typeof ZExtractionStatus>;

export const ZPaymentStatus = z.enum([
    "paid",
    "unpaid",
    "partial",
    "refunded",
]);
export type PaymentStatus = z.infer<typeof ZPaymentStatus>;

export const ZInvoiceType = z.enum([
    "invoice",
    "receipt",
    "credit_note",
]);
export type InvoiceType = z.infer<typeof ZInvoiceType>;

export const ZInvoiceError = z.object({
    code: z.string().nullable().optional(),
    message: z.string().nullable().optional(),
})

export type InvoiceErrorResource = z.infer<typeof ZInvoiceError>

export const ZExtraction = z.object({
    ocrEngine: ZOCREngine.nullable().optional(),
    analyzeEngine: ZAnalyzeEngine.nullable().optional(),
    raw: z.string().nullable().optional(),
    status: ZExtractionStatus.nullable().optional(),
    error: ZInvoiceError.nullable().optional(),
})

export type ExtractionResource = z.infer<typeof ZExtraction>;

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
})

export type PaymentResource = z.infer<typeof ZPayment>;

export const ZLineItem = z.object({
    item: z.string().nullable().optional(),
    code: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    quantity: z.number().nullable().optional(),
    unitPrice: z.number().nullable().optional(),
    price: z.number().nullable().optional(),
    totalPrice: z.number().nullable().optional(),
    tax: z.array(ZTax).nullable().optional(),
    discount: z.string().nullable().optional(),
})

export const ZInvoiceDocument = z.object({
    type: ZInvoiceType.nullable().optional(),

    number: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    recipient: ZRecipient.nullable().optional(),
    vendorId: z.string().nullable().optional(),

    issuedAt: z.string().nullable().optional(),
    dueDate: z.string().nullable().optional(),

    shippingFee: z.number().nullable().optional(),
    balanceDue: z.number().nullable().optional(),
    paidAmount: z.number().nullable().optional(),
    subTotal: z.number().nullable().optional(),

    total: z.number().nullable().optional(),
    currency: z.string().nullable().optional(),

    lineItems: z.array(ZLineItem).nullable().optional(),
    payment: ZPayment.nullable().optional(),
    subscription: ZSubscription.nullable().optional(),

    manualReviewRequired: z.boolean().optional(),
    confidenceScore: z.number().nullable().optional(),
})

export type InvoiceDocumentResource = z.infer<typeof ZInvoiceDocument>;

export const ZSource = z.object({
    slug: z.enum(AppSlug).nullable().optional(),
    category: z.enum(AppCategory).nullable().optional(),
    extractedAt: z.date().nullable().optional(),
    mail: ZMail.nullable().optional(),
})

export type SourceResource = z.infer<typeof ZSource>;

export const ZInvoice = z.object({
    _id: z.string().optional(),
    userId: z.string().optional().nullable(),
    orgId: z.string().nullable().optional(),

    invoice: ZInvoiceDocument.nullable().optional(),

    attachmentId: z.string().nullable().optional(),

    source: ZSource.optional(),
    extraction: ZExtraction.nullable().optional(),

    isInvoice: z.boolean().optional(),
    isRefund: z.boolean().optional(),

    vendorDoc: ZVendor.nullable().optional(),

    createdAt: z.number().optional(),
    updatedAt: z.number().optional(),
})

export type InvoiceResource = z.infer<typeof ZInvoice>;
