import z from "zod"
import { ZInvoiceFileFormatPreference } from "./preference/invoiceFileFormatPreference.schema"
import { AppSlug } from "../apps/app.schema"

export const ZOrganizationMetadata = z.object({
    isActive: z.boolean().optional(),
})

export const ZOrganizationPreference = z.object({
    invoiceFileNameFormat: ZInvoiceFileFormatPreference.optional(),
})

export const ZUsage = z.object({
    invoices: z.number().default(0),
    emailAccounts: z.number().default(0),
    mobileScanners: z.number().default(0),
    integrations: z.object({
        [AppSlug.XERO]: z.boolean().default(false),
        [AppSlug.GOOGLE_DRIVE]: z.boolean().default(false),
    }).optional(),
})

export const ZOrganization = z.object({
    _id: z.string().optional(),
    clerkOrgId: z.string().optional(),
    name: z.string().nullable().optional(),
    slug: z.string().nullable().optional(),
    createdBy: z.string().nullable().optional(),
    logoUrl: z.string().nullable().optional(),
    preference: ZOrganizationPreference.optional().nullable(),
    metadata: ZOrganizationMetadata.optional().nullable(),
    usage: ZUsage.optional().nullable(),

    createdAt: z.number().optional(),
    updatedAt: z.number().optional(),
})

export type UsageResource = z.infer<typeof ZUsage>
export type OrganizationPreferenceResource = z.infer<typeof ZOrganizationPreference>
export type OrganizationMetadataResource = z.infer<typeof ZOrganizationMetadata>
export type OrganizationResource = z.infer<typeof ZOrganization>