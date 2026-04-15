import z from "zod";

export const ZAddAccounting = z.object({
    code: z.string(),
    state: z.string(),
    callbackUrl: z.string(),
})

export type TAddAccountingResponse = {
    redirectAfter: string
}

export type TAddAccounting = z.infer<typeof ZAddAccounting>