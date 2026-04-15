import mongoose from "mongoose";
import { timestampPlugin } from "../plugin/timestamps.plugin";
import { ScanChunkResource, ScanChunkStatus } from "@snappin/shared/inbox/scan.schema";

const RateLimitSchema = new mongoose.Schema(
    {
        isThrottled: { type: Boolean, default: false },
        throttledAt: { type: Number, default: null },
        retryAfter: { type: Number, default: null },
        retryAfterAt: { type: Number, default: null },
        retryCount: { type: Number, default: 0 },
        lastThrottleReason: { type: String, default: null },
    },
    { _id: false }
);

const ScanChunkSchema = new mongoose.Schema<ScanChunkResource>({
    scanId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    integrationId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    startDate: { type: Number, required: true },
    endDate: { type: Number, required: true },
    status: {
        type: String,
        enum: Object.values(ScanChunkStatus),
        default: ScanChunkStatus.QUEUED,
        index: true
    },
    pageToken: { type: String, default: null },
    hasMorePages: { type: Boolean, default: true },
    totalMessages: { type: Number, default: 0 },
    processedMessages: { type: Number, default: 0 },
    failedMessages: { type: Number, default: 0 },
    rateLimit: {
        type: RateLimitSchema,
        default: () => ({
            isThrottled: false,
            throttledAt: null,
            retryAfter: null,
            retryAfterAt: null,
            retryCount: 0,
            lastThrottleReason: null,
        }),
    },
    errorReason: { type: String, default: null },

    // ✅ Fix 5: these were in the type but missing from the schema
    startedAt: { type: Number, default: null },
    completedAt: { type: Number, default: null },

    expiresAt: { type: Date, default: null },
    createdAt: Number,
    updatedAt: Number,
});

ScanChunkSchema.plugin(timestampPlugin);
ScanChunkSchema.index({ scanId: 1, status: 1 });
ScanChunkSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, sparse: true });

ScanChunkSchema.virtual("integration", {
    ref: "Integration",
    localField: "integrationId",
    foreignField: "_id",
    justOne: true
});

// ✅ Add toJSON/toObject so virtuals serialize correctly (was missing)
ScanChunkSchema.set("toJSON", { virtuals: true });
ScanChunkSchema.set("toObject", { virtuals: true });

export const ScanChunk =
    (mongoose.models.ScanChunk as mongoose.Model<ScanChunkResource>) ??
    mongoose.model<ScanChunkResource>("ScanChunk", ScanChunkSchema, "scan_chunks");