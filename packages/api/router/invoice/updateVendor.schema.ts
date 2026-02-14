import z from "zod";

export const ZUpdateVendor = z.object({
    invoiceId: z.string(),
    newVendorId: z.string(),
})

export type TUpdateVendor = z.infer<typeof ZUpdateVendor>