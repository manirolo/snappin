import { z } from "zod";
import { ZInvoiceDocument } from "@snappin/shared/invoice/invoice.schema";

export const ZInvoiceDocumentAI = ZInvoiceDocument

export type TInvoiceDocumentAI = z.infer<typeof ZInvoiceDocumentAI>
