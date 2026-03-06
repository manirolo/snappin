import { z } from "zod"

export const ZGetInvoiceThumbnailUrl = z.object({
    thumbnailId: z.string().min(1),
})

export type TGetInvoiceThumbnailUrl = z.infer<typeof ZGetInvoiceThumbnailUrl>