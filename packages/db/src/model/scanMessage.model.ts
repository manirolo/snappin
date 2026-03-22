import mongoose from "mongoose";
import { timestampPlugin } from "../plugin/timestamps.plugin";
import { ScanMessageResource, ScanMessageStatus } from "@snappin/shared/inbox/scan.schema";

const ScanMessageSchema = new mongoose.Schema<ScanMessageResource>({
    scanId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    chunkId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    integrationId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    providerMessageId: { type: String, required: true },
    status: {
        type: String,
        enum: Object.values(ScanMessageStatus),
        default: ScanMessageStatus.QUEUED,
        index: true
    },
    invoiceId: { type: mongoose.Schema.Types.ObjectId, default: null },
    errorReason: { type: String, default: null },
    retryCount: { type: Number, default: 0 },

    expiresAt: { type: Date, default: null },
    createdAt: Number,
    updatedAt: Number,
});

ScanMessageSchema.plugin(timestampPlugin);

ScanMessageSchema.index({ scanId: 1, providerMessageId: 1 }, { unique: true });
ScanMessageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, sparse: true });

// ✅ Fix 6: integration virtual was in the type but missing from the schema
ScanMessageSchema.virtual("integration", {
    ref: "Integration",
    localField: "integrationId",
    foreignField: "_id",
    justOne: true
});

// ✅ Add toJSON/toObject so virtuals serialize correctly (was missing)
ScanMessageSchema.set("toJSON", { virtuals: true });
ScanMessageSchema.set("toObject", { virtuals: true });

export const ScanMessage =
    (mongoose.models.ScanMessage as mongoose.Model<ScanMessageResource>) ??
    mongoose.model<ScanMessageResource>("ScanMessage", ScanMessageSchema, "scan_messages");