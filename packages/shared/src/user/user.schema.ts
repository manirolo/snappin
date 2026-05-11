import z from "zod";

export const ZBillingAccount = z.object({
    customerId: z.string().optional().nullable(),
    portalUrl: z.string().optional().nullable(),
    portalUrlExpiresAt: z.string().optional().nullable(),
})

export const ZUserMetadata = z.object({
    isActive: z.boolean().optional(),
    isFlagged: z.boolean().optional(),
})

export const ZUser = z.object({
    _id:           z.string().optional(),
    clerkUserId:   z.string().optional(),
    email:         z.string().nullable().optional(),
    fullName:      z.string().nullable().optional(),
    profileUrl:    z.string().nullable().optional(),
    billingAccount: ZBillingAccount.optional().nullable(),
    metadata:      ZUserMetadata.optional().nullable(),
    createdAt:     z.number().optional(),
    updatedAt:     z.number().optional(),
})

export type BillingAccountResource = z.infer<typeof ZBillingAccount>
export type UserMetadataResource = z.infer<typeof ZUserMetadata>
export type UserResource = z.infer<typeof ZUser>