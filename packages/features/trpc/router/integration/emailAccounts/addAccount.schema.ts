import z from "zod";

export const ZAddAccount = z.object({
    code: z.string(),
    state: z.string(),
    callbackUrl: z.string(),
})

export type TAddAccountResponse = {
    redirectAfter: string
}

export type TAddAccount = z.infer<typeof ZAddAccount>