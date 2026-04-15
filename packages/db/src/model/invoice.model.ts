import mongoose from "mongoose"
import { timestampPlugin } from "../plugin/timestamps.plugin"
import { ZInvoiceType, ZPaymentStatus, ZPaymentMethod, InvoiceResource, LineItemsResource, PaymentResource, RecipientResource, TaxResource, InvoiceSubscriptionResource, ZInvoiceSubscriptionFrequency, IntegrationExportMeta } from "@snappin/shared/invoice/invoice.schema"
import { AppSlug } from "@snappin/shared/apps/app.schema"

const Recipient = new mongoose.Schema<RecipientResource>({
    name: { type: String, default: null },
    email: { type: String, default: null },
    taxId: { type: String, default: null },
    address: { type: String, default: null }
}, { _id: false })

const Tax = new mongoose.Schema<TaxResource>({
    rate: { type: Number, default: null },
    amount: { type: Number, default: null }
}, { _id: false })

const LineItem = new mongoose.Schema<LineItemsResource>({
    description: { type: String, default: null },
    quantity: { type: Number, default: null },
    unitPrice: { type: Number, default: null },
    discount: { type: Number, default: null },
    tax: { type: Tax, default: null },
    total: { type: Number, default: null }
}, { _id: false })

const Totals = new mongoose.Schema({
    subtotal: { type: Number, default: null },
    discount: { type: Number, default: null },
    tax: { type: Tax, default: null },
    total: { type: Number, default: null },
    currency: { type: String, uppercase: true, minlength: 3, maxlength: 3, default: null }
}, { _id: false })

const Payment = new mongoose.Schema<PaymentResource>({
    status: { type: String, enum: ZPaymentStatus.options, default: ZPaymentStatus.options[1] },
    method: { type: String, enum: ZPaymentMethod.options, default: null },
    terms: { type: String, default: null },
    last4Digits: { type: String, default: null }
}, { _id: false })

const Subscription = new mongoose.Schema<InvoiceSubscriptionResource>({
    isRecurring: { type: Boolean, default: false },
    frequency: { type: String, enum: ZInvoiceSubscriptionFrequency.options, default: null },
    nextBillingDate: { type: String, default: null }
}, { _id: false })

const Metadata = new mongoose.Schema({
    documentType: { type: String, enum: ZInvoiceType.options, default: ZInvoiceType.options[0] },
    subscription: { type: Subscription, default: null }
}, { _id: false })

const IntegrationExportMetaSchema = new mongoose.Schema<IntegrationExportMeta>({
    appSlug: { type: String, enum: Object.values(AppSlug), required: true },
    integrationId: { type: String, required: true },
    exportedAt: { type: Number, default: null },
    externalId: { type: String, default: null },
    url: { type: String, default: null },
    syncedAt: { type: Number, default: null },
    error: { type: String, default: null },
}, { _id: false })

const InvoiceSchema = new mongoose.Schema<InvoiceResource>({
    userId: { type: String, required: true },
    orgId: { type: String, default: null },
    invoiceId: { type: String, default: null },
    invoiceDate: { type: String, default: null },
    dueDate: { type: String, default: null },
    description: { type: String, default: null },
    recipient: { type: Recipient, default: null },
    totals: { type: Totals, default: null },
    lineItems: { type: [LineItem], default: null },
    payment: { type: Payment, default: null },
    metadata: { type: Metadata, required: true },
    extractionId: { type: String, default: null },
    vendorId: { type: String, default: null },
    integrations: { type: [IntegrationExportMetaSchema], default: [] },
    createdAt: { type: Number },
    updatedAt: { type: Number }
})

InvoiceSchema.plugin(timestampPlugin)

InvoiceSchema.virtual("vendor", { ref: "Vendor", localField: "vendorId", foreignField: "_id", justOne: true })

InvoiceSchema.virtual("extraction", { ref: "InvoiceExtractionRequest", localField: "extractionId", foreignField: "_id", justOne: true })

InvoiceSchema.set("toJSON", { virtuals: true })
InvoiceSchema.set("toObject", { virtuals: true })

InvoiceSchema.index({ userId: 1 })
InvoiceSchema.index({ orgId: 1 })
InvoiceSchema.index({ vendorId: 1 })
InvoiceSchema.index({ invoiceDate: -1 })

export const Invoice: mongoose.Model<InvoiceResource> =
    (mongoose.models.Invoice as mongoose.Model<InvoiceResource>) ??
    mongoose.model<InvoiceResource>("Invoice", InvoiceSchema, "invoice")