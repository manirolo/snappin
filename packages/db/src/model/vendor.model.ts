import { Model, models, Schema, model } from "mongoose"
import { timestampPlugin } from "../plugin/timestamps.plugin"
import { VendorResource } from "@snappin/shared/invoice/vendor.schema";

const VendorSchema = new Schema<VendorResource>({
    userId: { type: String, required: true },
    orgId: { type: String, default: null },
    name: { type: String, default: null },
    aliasName: { type: String, default: null },
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

export const Vendor: Model<VendorResource> = (models.Vendor as Model<VendorResource>) ?? model<VendorResource>("Vendor", VendorSchema, "vendor");