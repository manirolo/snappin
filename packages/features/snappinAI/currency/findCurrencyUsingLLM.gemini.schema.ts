import z from "zod";

export const ZCurrencyOnlyResponse = z.object({
    currency: z.string().length(3).nullable()
})