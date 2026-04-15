import z from "zod";

export const ZAddStorage = z.object({
    code: z.string(),
    state: z.string(),
    callbackUrl: z.string(),
})

export type TAddStorageResponse = {
    redirectAfter: string
}

export type TAddStorage = z.infer<typeof ZAddStorage>