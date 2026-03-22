import z from "zod";

export const ZAddMobileScanner = z.object({
    phone: z.string()
})

export type TAddMobileScanner = z.infer<typeof ZAddMobileScanner>