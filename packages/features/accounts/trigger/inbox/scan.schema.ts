import z from 'zod'

export const ZScan = z.object({
    scanId: z.string()
})