import { AppSlug, AppCategory } from "@snappin/shared/apps/app.enum"
import { Model, models, Schema } from "mongoose"
import { timestampPlugin } from "../plugin/timestamps.plugin"
import { model } from "mongoose"
import { AttachmentResource, MailResource } from "@snappin/shared/inbox/mail.schema"
import {
    ZAnalyzeEngine,
    ZOCREngine,
    ZExtractionStatus,
    ZInvoiceType,
    ZPaymentStatus,
    InvoiceResource,
    InvoiceDocumentResource,
    ExtractionResource,
    LineItemsResource,
    PaymentResource,
    RecipientResource,
    SourceResource,
    TaxResource,
    InvoiceErrorResource,
    InvoiceSubscriptionResource,
    ZInvoiceSubscriptionFrequency
} from "@snappin/shared/invoice/invoice.schema"

const Attachment = new Schema<AttachmentResource>({
    fileName: { type: String, default: null },
    mimeType: { type: String, default: null },
    attachmentId: { type: String, default: null }
})

const Mail = new Schema<MailResource>({
    from: { type: String, default: null },
    to: { type: String, default: null },
    id: { type: String, default: null },
    subject: { type: String, default: null },
    body: { type: String, default: null },
    attachments: { type: [Attachment], default: [] },
})

const Receipt = new Schema<RecipientResource>({
    name: { type: String, default: null },
    phone: { type: String, default: null },
    emailId: { type: String, default: null },
    address: { type: String, default: null },
    state: { type: String, default: null },
    country: { type: String, default: null },
    zipCode: { type: String, default: null },
})

const TaxDetails = new Schema<TaxResource>({
    taxType: { type: String, default: null },
    taxRate: { type: Number, default: null },
    taxAmount: { type: Number, default: null }
})

const LineItems = new Schema<LineItemsResource>({
    item: { type: String, default: null },
    code: { type: String, default: null },
    description: { type: String, default: null },
    quantity: { type: Number, default: null },
    unitPrice: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    // NOTE: Stored as Number for v1, migrate to Decimal128 or minor units later
    totalPrice: { type: Number, default: 0 },
    tax: { type: TaxDetails, default: null },
    discount: { type: String, default: null }
})

const Payment = new Schema<PaymentResource>({
    status: { type: String, enum: ZPaymentStatus.options, default: ZPaymentStatus.options[1] },
    paymentTerms: { type: String, default: null },
    paymentMethod: { type: String, default: "other" },
    paymentDate: { type: String, default: null },
    paymentDueDate: { type: String, default: null },
    transactionId: { type: String, default: null }
})

const Subscription = new Schema<InvoiceSubscriptionResource>({
    frequency: { type: String, enum: ZInvoiceSubscriptionFrequency.options, default: null },
    isRecurring: { type: Boolean, default: false },
    nextBillingDate: { type: String, default: null }
})

const InvoiceDocument = new Schema<InvoiceDocumentResource>({
    type: { type: String, enum: ZInvoiceType.options, default: ZInvoiceType.options[0] },
    number: { type: String, default: null },
    description: { type: String, default: null },
    recipient: { type: Receipt, default: null },
    vendorId: { type: String, default: null },
    issuedAt: { type: String, default: null },
    dueDate: { type: String, default: null },
    shippingFee: { type: Number, default: null },
    balanceDue: { type: Number, default: null },
    paidAmount: { type: Number, default: null },
    subTotal: { type: Number, default: null },
    // NOTE: Stored as Number for v1, migrate to Decimal128 or minor units later
    total: { type: Number, default: null },
    currency: { type: String, default: "USD", uppercase: true, minlength: 3, maxlength: 3 },
    lineItems: { type: [LineItems], default: null },
    payment: { type: Payment, default: null },
    subscription: { type: Subscription, default: null },
    manualReviewRequired: { type: Boolean, default: false },
    confidenceScore: { type: Number, default: null },
})

const Source = new Schema<SourceResource>({
    slug: { type: String, enum: AppSlug, default: null },
    category: { type: String, enum: AppCategory, default: null },
    extractedAt: { type: Date, default: Date.now() },
    mail: { type: Mail, default: null }
})

const InvoiceError = new Schema<InvoiceErrorResource>({
    code: { type: String, default: null },
    message: { type: String, default: null }
})

const Extraction = new Schema<ExtractionResource>({
    ocrEngine: { type: String, enum: ZOCREngine.options, default: null },
    analyzeEngine: { type: String, enum: ZAnalyzeEngine.options, default: null },
    raw: { type: String, default: null },
    status: { type: String, enum: ZExtractionStatus.options, default: ZExtractionStatus.options[0] },
    error: { type: InvoiceError, default: null }
})

const InvoiceSchema = new Schema<InvoiceResource>({
    userId: { type: String, required: true },
    orgId: { type: String, default: null },
    invoice: { type: InvoiceDocument, default: null },
    source: { type: Source, default: null },
    extraction: { type: Extraction, default: null },
    attachmentId: { type: String, default: null },
    isInvoice: { type: Boolean, default: true },
    isRefund: { type: Boolean, default: false },
    createdAt: Number,
    updatedAt: Number
})

InvoiceSchema.plugin(timestampPlugin)

InvoiceSchema.virtual("vendorDoc", {
    ref: "Vendor",
    localField: "invoice.vendorId",
    foreignField: "_id",
    justOne: true
})

InvoiceSchema.set("toJSON", { virtuals: true });
InvoiceSchema.set("toObject", { virtuals: true });

export const Invoice: Model<InvoiceResource> = (models.Invoice as Model<InvoiceResource>) ?? model<InvoiceResource>("Invoice", InvoiceSchema, "invoice");