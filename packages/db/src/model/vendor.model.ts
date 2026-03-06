import mongoose from "mongoose"
import { timestampPlugin } from "../plugin/timestamps.plugin"
import { VendorResource } from "@snappin/shared/vendor/vendor.schema";

const VendorSchema = new mongoose.Schema<VendorResource>({
    userId: { type: String, required: true },
    orgId: { type: String, default: null },
    name: { type: String, default: null },
    legalName: { type: String, default: null },
    address: { type: String, default: null },
    businessRegistrationId: { type: String, default: null },
    phone: { type: String, default: null },
    website: { type: String, default: null },
    taxType: { type: String, default: null },
    taxId: { type: String, default: null },
    emailId: { type: String, default: null, index: true },
    createdAt: Number,
    updatedAt: Number
})

VendorSchema.plugin(timestampPlugin)

export const Vendor: mongoose.Model<VendorResource> = (mongoose.models.Vendor as mongoose.Model<VendorResource>) ?? mongoose.model<VendorResource>("Vendor", VendorSchema, "vendor");