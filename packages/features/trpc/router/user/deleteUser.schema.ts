import z from "zod";

export const ZDeleteUser = z.object({
    userId: z.string()
})

export type TDeleteUser = z.infer<typeof ZDeleteUser>