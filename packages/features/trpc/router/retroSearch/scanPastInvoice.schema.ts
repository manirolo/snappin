import { z } from "zod"

export const ScanPastInvoicesSchema = z.object({
  email: z.string().email(),
  from: z.number(), // unix ms timestamp
  to: z.number(),   // unix ms timestamp
})

export type TScanPastInvoices = z.infer<typeof ScanPastInvoicesSchema>