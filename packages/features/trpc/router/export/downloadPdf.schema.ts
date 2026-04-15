import z from "zod";

export const ZDownloadPdf = z.object({
    invoiceId: z.string()
})

export type TDownloadPdf = z.infer<typeof ZDownloadPdf>