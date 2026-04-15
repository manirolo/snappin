// import { DATE_FORMAT_IDS } from "@snappin/lib/date";
import z from "zod";
export const DATE_FORMAT_IDS = [
    "DD_MMM_YYYY",
    "DD_MMMM_YYYY",
    "MMM_DD_YYYY",
    "MMMM_DD_YYYY",
    "YYYY_MMM_DD",
    "YYYY_MMMM_DD",
    "DD_MM_YYYY",
    "MM_DD_YYYY",
    "YYYY_MM_DD",
    "YYYY_MM_DD_SLASH",
    "YYYYMMDD",
    "DDMMYYYY",
] as const

export const ZFileFormatComponent = z.enum(["date", "vendor", "invoiceId", "amount", "currency"]);

export const ZFileSeparator = z.enum(["-", "_"]);

export const ZDateFormatId = z.enum(DATE_FORMAT_IDS)

export type DateFormatId = z.infer<typeof ZDateFormatId>

export const ZInvoiceFileFormatPreference = z.object({
    components: z.array(ZFileFormatComponent).default(["date", "vendor", "vendor"]),
    separator: ZFileSeparator.default("_"),
    dateFormat: ZDateFormatId.default("DD_MM_YYYY"),
    uppercase: z.boolean().default(false),
})

export type FileFormatComponent = z.infer<typeof ZFileFormatComponent>
export type FileSeparator = z.infer<typeof ZFileSeparator>
export type InvoiceFileFormatPreference = z.infer<typeof ZInvoiceFileFormatPreference>