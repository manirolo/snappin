import { AppSlug } from "@snappin/shared/apps/app.enum"
import { Model, models, Schema } from "mongoose"
import { timestampPlugin } from "../plugin/timestamps.plugin"
import { model } from "mongoose"

export type InvoiceResource = {

    // User and organization data
    _id?: string

    userId?: string

    orgId?: string | null

    // On invoice email data
    fromAddress?: string | null

    toAddress?: string | null

    mailId?: string | null

    mailSubject?: string | null

    attachments?: {
        fileName: string
        mimeType: string
        attachmentId: string
    }[]

    // Invoice data
    invoiceId?: string | null
    invoiceDate?: Date | null
    vendor: {
        name?: string | null
        address?: string | null
    }
    taxAmount?: number | string | null
    currency?: string

    // Document storage data
    // Default it will be stored in Snappin Server
    // User can integrate google drive, and one drive to store the documents

    // TODO: Drive integration in further

    // Integration source data
    extractedFrom?: AppSlug | null

    // Extraction process output and details
    extractedOn: Date
    isInvoice: boolean
    isRefund: boolean

    // Timestamps
    createdAt?: number
    updatedAt?: number
}

const Attachment = {
    fileName: { type: String, default: null },
    mimeType: { type: String, default: null },
    attachmentId: { type: String, default: null }
}

const InvoiceSchema = new Schema<InvoiceResource>({
    userId: { type: String, required: true },
    orgId: { type: String, default: null },
    fromAddress: { type: String, default: null },
    toAddress: { type: String, default: null },
    mailId: { type: String, default: null },
    mailSubject: { type: String, default: null },
    attachments: { type: [Attachment], default: null },
    invoiceId: { type: String, default: null },
    invoiceDate: { type: Date, default: null },
    vendor: {
        name: { type: String, default: null },
        address: { type: String, default: null }
    },
    taxAmount: { type: Number, default: null },
    currency: { type: String, default: "$" },
    extractedFrom: { type: String, enum: AppSlug },
    extractedOn: { type: Date, default: new Date() },
    isInvoice: { type: Boolean, default: true },
    isRefund: { type: Boolean, default: false },
    createdAt: Number,
    updatedAt: Number
})

InvoiceSchema.plugin(timestampPlugin)

export const Invoice: Model<InvoiceResource> = (models.Invoice as Model<InvoiceResource>) ?? model<InvoiceResource>("Invoice", InvoiceSchema, "invoice");