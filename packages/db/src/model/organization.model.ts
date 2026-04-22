import mongoose from "mongoose";
import { OrganizationResource, OrganizationPreferenceResource, OrganizationMetadataResource } from "@snappin/shared/organization/organization.schema"
import { InvoiceFileFormatPreference } from "@snappin/shared/organization/preference/invoiceFileFormatPreference.schema"
import { timestampPlugin } from "../plugin/timestamps.plugin";
import { AppSlug } from "@snappin/shared/apps/app.schema";

const OrganizationMetadataSchema = new mongoose.Schema<OrganizationMetadataResource>({
    isActive: { type: Boolean, default: null },
}, { _id: false })

const IntegrationLimitsSchema = new mongoose.Schema(
    {
        [AppSlug.XERO]: { type: Boolean, default: false },
        [AppSlug.GOOGLE_DRIVE]: { type: Boolean, default: false },
    },
    { _id: false }
)

const UsageSchema = new mongoose.Schema(
    {
        invoices: { type: Number, default: 0 },
        emailAccounts: { type: Number, default: 0 },
        mobileScanners: { type: Number, default: 0 },
        integrations: { type: IntegrationLimitsSchema, default: {} },
    },
    { _id: false }
)


const InvoiceFileFormatSchema = new mongoose.Schema<InvoiceFileFormatPreference>({
    components: { type: [String], default: ["date", "vendor", "invoiceId"] },
    separator: { type: String, enum: ["-", "_"], default: "_" },
    dateFormat: { type: String, default: "MMM_DD_YYYY" },
    uppercase: { type: Boolean, default: false },
}, { _id: false })

const OrganizationPreferenceSchema = new mongoose.Schema<OrganizationPreferenceResource>({
    invoiceFileNameFormat: { type: InvoiceFileFormatSchema, default: () => ({}) },
}, { _id: false })

const OrganizationSchema = new mongoose.Schema<OrganizationResource>({
    clerkOrgId: { type: String, default: null, unique: true, index: true },
    name: { type: String, default: null, unique: true },
    slug: { type: String, default: null },
    createdBy: { type: String, default: null },
    logoUrl: { type: String, default: null },
    preference: { type: OrganizationPreferenceSchema, default: () => ({}) },
    metadata: { type: OrganizationMetadataSchema, default: null },
    usage: { type: UsageSchema, default: {} },
    createdAt: { type: Number },
    updatedAt: { type: Number },
})

OrganizationSchema.plugin(timestampPlugin)

OrganizationSchema.set("toJSON", { virtuals: true })
OrganizationSchema.set("toObject", { virtuals: true })

export const Organization: mongoose.Model<OrganizationResource> =
    (mongoose.models.Organization as mongoose.Model<OrganizationResource>) ??
    mongoose.model<OrganizationResource>("Organization", OrganizationSchema, "organization")