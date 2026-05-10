import { ZBufferAttachment } from "@snappin/features/invoice/trigger/invoice.extractRequest.schema";
import z from "zod";

export const ZConvertToExcel = ZBufferAttachment

export type TConvertToExcel = z.infer<typeof ZConvertToExcel>