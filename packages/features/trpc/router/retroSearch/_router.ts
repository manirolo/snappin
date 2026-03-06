import { createTRPCRouter, protectedProcedure } from "@snappin/features/trpc/_trpc";
import { ScanPastInvoicesSchema } from "./scanPastInvoice.schema"
import { scanPastInvoices } from "./scanPastInvoice.handler"
import { getScans, GetScans } from "./getScans.handler";

export const scanPastInvoiceRouter = createTRPCRouter({
  scanPastInvoices: protectedProcedure
    .input(ScanPastInvoicesSchema)
    .mutation(({ ctx, input }) => scanPastInvoices({ ctx, input })),
  getScans: protectedProcedure.query(async(opts: GetScans) => getScans(opts))
})