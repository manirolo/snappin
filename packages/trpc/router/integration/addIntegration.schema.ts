import z from "zod";

export const ZAddIntegration = z.object({
    code: z.string(),
    state: z.string(),
})

export type TAddIntegrationResponse = {
    redirectAfter: string
}

export type TAddIntegration = z.infer<typeof ZAddIntegration>