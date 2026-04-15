import mongoose from "mongoose"
import { timestampPlugin } from "../plugin/timestamps.plugin"
import { ScanResource, ScanStatus } from "@snappin/shared/inbox/scan.schema";

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

const ScanSchema = new mongoose.Schema<ScanResource>({
    userId: { type: String, required: true },
    orgId: { type: String, default: null },
    scanId: { type: String, default: null, index: true },
    integrationId: { type: mongoose.Schema.Types.ObjectId, default: null },
    startDate: { type: Number, default: null },
    endDate: { type: Number, default: null },

    // ✅ Fix 1: was missing these fields from the type
    totalChunks: { type: Number, default: null },
    completedChunks: { type: Number, default: null },
    totalMessages: { type: Number, default: null },
    processedMessages: { type: Number, default: null },
    failedMessages: { type: Number, default: null },
    startedAt: { type: Number, default: null },
    completedAt: { type: Number, default: null },

    // ✅ Fix 2: enum must use Object.values(), not the enum object itself
    status: { type: String, enum: Object.values(ScanStatus), default: ScanStatus.QUEUED },

    errorReason: { type: String, default: null },

    // ✅ Fix 3: array field default should be [] not null
    invoiceFound: { type: [String], default: [] },
    _integration: {
        type: {
            id: { type: String, default: null },
            appSlug: { type: String, default: null },
            identifier: { type: String, default: null },
        },
        default: null,
        _id: false,
    },

    // ✅ Fix 4: rateLimit object was missing; rateLimitHits/wasThrottled are
    //           now nested inside rateLimit — remove the flat fields
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
    estimatedDuration: { type: String, default: null },

    createdAt: Number,
    updatedAt: Number,
})

ScanSchema.plugin(timestampPlugin)

ScanSchema.virtual("integration", {
    ref: "Integration",
    localField: "integrationId",
    foreignField: "_id",
    justOne: true
})

ScanSchema.set("toJSON", { virtuals: true });
ScanSchema.set("toObject", { virtuals: true });

export const Scan: mongoose.Model<ScanResource> =
    (mongoose.models.Scan as mongoose.Model<ScanResource>) ??
    mongoose.model<ScanResource>("Scan", ScanSchema, "scan");