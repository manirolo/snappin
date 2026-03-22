import { z } from "zod";
import { LineAmountType } from "@snappin/apps/appRegistry.interface";

export const ZCreateBill = z.object({
    integrationId: z.string(),
    invoiceId: z.string(),
    accountCode: z.string(),
    lineAmountType: z.nativeEnum(LineAmountType).default(LineAmountType.EXCLUSIVE),
});
export type TCreateBill = z.infer<typeof ZCreateBill>;