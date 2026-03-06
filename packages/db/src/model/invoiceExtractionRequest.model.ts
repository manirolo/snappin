import mongoose, { Schema } from "mongoose";
import { TOCREngine, AnalyzeEngine, ZExtractionStatus }
    from "@snappin/shared/invoiceExtractRequest/invoiceExtractionRequest.schema";
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
        metadata: { type: Schema.Types.Mixed, required: true }
    },
    status: { type: String, enum: ZExtractionStatus.options, default: "queued", index: true },

    ocrEngine: { type: String, enum: Object.values(TOCREngine), default: null },

    analyzeEngine: { type: String, enum: Object.values(AnalyzeEngine), default: null },

    error: { code: { type: String, default: null }, message: { type: String, default: null } },

    attempts: { type: Number, default: 0 },

    invoiceId: { type: String, default: null, index: true },

    startedAt: { type: Number, default: null },

    completedAt: { type: Number, default: null },

    createdAt: Number,
    updatedAt: Number
});

InvoiceExtractionRequestSchema.virtual("integration", {
  ref:          "Integration",
  localField:   "source.integrationId", 
  foreignField: "_id",
  justOne:      true,
});

InvoiceExtractionRequestSchema.plugin(timestampPlugin)

export const InvoiceExtractionRequestModel = mongoose.model("InvoiceExtractionRequest", InvoiceExtractionRequestSchema);
