import z from "zod"

export const ZVendor = z.object({
    _id: z.string().nullable().optional(),
    userId: z.string().nullable().optional(),
    orgId: z.string().nullable().optional(),

    name: z.string().nullable().optional(),
    legalName: z.string().nullable().optional(),
    businessRegistrationId: z.string().nullable().optional(),
    emailId: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    website: z.string().nullable().optional(),

    taxId: z.string().nullable().optional(),
    taxType: z.string().nullable().optional(),

    address: z.string().nullable().optional(),
    state: z.string().nullable().optional(),
    country: z.string().nullable().optional(),
    zipCode: z.string().nullable().optional(),

    createdAt: z.number().optional(),
    updatedAt: z.number().optional(),
}).strict();

export type VendorResource = z.infer<typeof ZVendor>;