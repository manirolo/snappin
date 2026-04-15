import mongoose, { Schema } from "mongoose";
import { InvoiceExtractionRequestResource, ZExtractionStatus } from "@snappin/shared/invoiceExtractRequest/invoiceExtractionRequest.schema";
import { timestampPlugin } from "../plugin/timestamps.plugin";

const InvoiceExtractionRequestSchema = new Schema({

    userId: { type: String, required: true, index: true },

    orgId: { type: String, default: null, index: true },

    jobId: { type: String, default: null },

    documentId: { type: String, required: true, index: true },
    fileName: { type: String, default: null },

    source: {
        kind: { type: String, required: true },
        integrationId: { type: String, default: null, },
        retroactiveScanId: { type: String, default: null },
        isRetroactiveScan: { type: Boolean, default: null },
        externalId: { type: String, default: null },
        metadata: { type: Schema.Types.Mixed, required: false }
    },
    status: { type: String, enum: ZExtractionStatus.options, default: "queued", index: true },

    error: { code: { type: String, default: null }, message: { type: String, default: null } },

    attempts: { type: Number, default: 0 },

    invoiceId: { type: String, default: null, index: true },

    _integration: {
        type: {
            id: { type: String, default: null },
            appSlug: { type: String, default: null },
            identifier: { type: String, default: null },
        },
        default: null,
        _id: false,
    },

    startedAt: { type: Number, default: null },

    completedAt: { type: Number, default: null },

    createdAt: Number,
    updatedAt: Number
});

InvoiceExtractionRequestSchema.virtual("integration", {
    ref: "Integration",
    localField: "source.integrationId",
    foreignField: "_id",
    justOne: true,
});

InvoiceExtractionRequestSchema.virtual("user", {
    ref: "User",
    localField: "source.metadata.uploadedBy",
    foreignField: "clerkUserId",
    justOne: true,
});

InvoiceExtractionRequestSchema.set("toJSON", { virtuals: true })
InvoiceExtractionRequestSchema.set("toObject", { virtuals: true })

InvoiceExtractionRequestSchema.plugin(timestampPlugin)

export const InvoiceExtractionRequestModel: mongoose.Model<InvoiceExtractionRequestResource> =
    (mongoose.models.InvoiceExtractionRequest as mongoose.Model<InvoiceExtractionRequestResource>)
    ?? mongoose.model("InvoiceExtractionRequest", InvoiceExtractionRequestSchema);