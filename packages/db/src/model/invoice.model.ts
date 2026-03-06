import { AppSlug } from "@snappin/shared/apps/app.schema"
import mongoose from "mongoose"
import { timestampPlugin } from "../plugin/timestamps.plugin"
import {
    ZInvoiceType,
    ZPaymentStatus,
    InvoiceResource,
    LineItemsResource,
    PaymentResource,
    RecipientResource,
    TaxResource,
    InvoiceSubscriptionResource,
    ZInvoiceSubscriptionFrequency
} from "@snappin/shared/invoice/invoice.schema"

const Receipt = new mongoose.Schema<RecipientResource>({
    name: { type: String, default: null },
    phone: { type: String, default: null },
    emailId: { type: String, default: null },
    address: { type: String, default: null },
    state: { type: String, default: null },
    country: { type: String, default: null },
    zipCode: { type: String, default: null },
})

const TaxDetails = new mongoose.Schema<TaxResource>({
    taxCode: { type: String, default: null },
    taxType: { type: String, default: null },
    taxRate: { type: Number, default: null },
    taxAmount: { type: Number, default: null }
})

const LineItems = new mongoose.Schema<LineItemsResource>({
    item: { type: String, default: null },
    code: { type: String, default: null },
    description: { type: String, default: null },
    quantity: { type: Number, default: null },
    unitPrice: { type: Number, default: 0 },
    subTotal: { type: Number, default: 0 },
    tax: { type: TaxDetails, default: null },
    // NOTE: Stored as Number for v1, migrate to Decimal128 or minor units later
    total: { type: Number, default: 0 },
    discount: { type: String, default: null }
})

const Payment = new mongoose.Schema<PaymentResource>({
    status: { type: String, enum: ZPaymentStatus.options, default: ZPaymentStatus.options[1] },
    paymentTerms: { type: String, default: null },
    paymentMethod: { type: String, default: "other" },
    paymentDate: { type: String, default: null },
    paymentDueDate: { type: String, default: null },
    transactionId: { type: String, default: null }
})

const Subscription = new mongoose.Schema<InvoiceSubscriptionResource>({
    frequency: { type: String, enum: ZInvoiceSubscriptionFrequency.options, default: null },
    isRecurring: { type: Boolean, default: false },
    nextBillingDate: { type: String, default: null }
})

const Attachment = new mongoose.Schema({
    appSlug: { type: String, enum: Object.values(AppSlug), required: true },
    fileId: { type: String, required: true },
    fileName: { type: String, default: null },
    path: { type: String, default: null },
    isPrimary: { type: Boolean, default: false },
}, { _id: false })

const InvoiceSchema = new mongoose.Schema<InvoiceResource>({
    userId: { type: String, required: true },
    orgId: { type: String, default: null },
    description: { type: String, default: null },
    recipient: { type: Receipt, default: null },
    vendorId: { type: String, default: null },
    invoiceDate: { type: String, default: null },
    dueDate: { type: String, default: null },
    subTotal: { type: Number, default: null },
    // NOTE: Stored as Number for v1, migrate to Decimal128 or minor units later
    total: { type: Number, default: null },
    tax: { type: TaxDetails, default: null },
    currency: { type: String, default: "USD", uppercase: true, minlength: 3, maxlength: 3 },
    lineItems: { type: [LineItems], default: null },
    payment: { type: Payment, default: null },
    metadata: {
        subscription: { type: Subscription, default: null },
        documentType: { type: String, enum: ZInvoiceType.options, default: ZInvoiceType.options[0] },
    },
    attachments: { type: [Attachment], default: [] },
    extractionId: { type: String, default: null },
    invoiceId: { type: String, default: null },
    createdAt: Number,
    updatedAt: Number
})

InvoiceSchema.plugin(timestampPlugin)

InvoiceSchema.virtual("vendor", {
    ref: "Vendor",
    localField: "vendorId",
    foreignField: "_id",
    justOne: true
})

InvoiceSchema.virtual("extraction", {
    ref: "InvoiceExtractionRequest",
    localField: "extractionId",
    foreignField: "_id",
    justOne: true
})

InvoiceSchema.set("toJSON", { virtuals: true });
InvoiceSchema.set("toObject", { virtuals: true });

InvoiceSchema.index({ userId: 1 })
InvoiceSchema.index({ orgId: 1 })
InvoiceSchema.index({ "invoice.vendorId": 1 })
InvoiceSchema.index({ "invoice.issuedAt": -1 })
InvoiceSchema.index({ "extraction.status": 1 })

export const Invoice: mongoose.Model<InvoiceResource> = (mongoose.models.Invoice as mongoose.Model<InvoiceResource>) ?? mongoose.model<InvoiceResource>("Invoice", InvoiceSchema, "invoice");