import { ZBufferAttachment } from "@snappin/features/invoice/trigger/invoice.extractRequest.schema";
import z from "zod";

export const ZUploadTempInvoice = ZBufferAttachment

export type TUploadTempInvoice = z.infer<typeof ZUploadTempInvoice>