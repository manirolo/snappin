import mongoose from "mongoose"
import { timestampPlugin } from "../plugin/timestamps.plugin"
import { ScanResource, ScanStatus } from "@snappin/shared/inbox/scan.schema";

const ScanSchema = new mongoose.Schema<ScanResource>({
    userId: { type: String, required: true },
    orgId: { type: String, default: null },
    scanId: { type: String, default: null },
    integrationId: { type: mongoose.Schema.Types.ObjectId, default: null },
    startDate: { type: Number, default: null },
    endDate: { type: Number, default: null },
    status: { type: String, enum: ScanStatus, default: ScanStatus.QUEUED },
    errorReason: { type: String, default: null },
    invoiceFound: { type: [String], default: null },
    rateLimitHits: { type: Number, default: null },
    wasThrottled: { type: Boolean, default: null },
    createdAt: Number,
    updatedAt: Number
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

export const Scan: mongoose.Model<ScanResource> = (mongoose.models.Scan as mongoose.Model<ScanResource>) ?? mongoose.model<ScanResource>("Scan", ScanSchema, "scan");