import mongoose from "mongoose";
import { timestampPlugin } from "../plugin/timestamps.plugin";
import {
    ScanMessageResource,
    ScanMessageStatus,
} from "@snappin/shared/inbox/scan.schema";

const ScanMessageSchema = new mongoose.Schema<ScanMessageResource>({
    scanId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    chunkId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    integrationId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    providerMessageId: { type: String, required: true },
    status: { type: String, enum: Object.values(ScanMessageStatus), default: ScanMessageStatus.QUEUED, index: true },
    invoiceId: { type: mongoose.Schema.Types.ObjectId, default: null },
    errorReason: { type: String, default: null },
    retryCount: { type: Number, default: 0 },
    createdAt: Number,
    updatedAt: Number,
});

ScanMessageSchema.plugin(timestampPlugin);

ScanMessageSchema.index(
    { scanId: 1, providerMessageId: 1 },
    { unique: true }
);

ScanMessageSchema.index({ chunkId: 1, status: 1 });
ScanMessageSchema.index({ integrationId: 1, status: 1 });

export const ScanMessage =
    (mongoose.models.ScanMessage as mongoose.Model<ScanMessageResource>) ??
    mongoose.model<ScanMessageResource>(
        "ScanMessage",
        ScanMessageSchema,
        "scan_messages"
    );