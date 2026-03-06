import z from "zod";

export const ZGetAccount = z.object({
    accountId: z.string()
})

export type TGetAccount = {
    accountId: string
}