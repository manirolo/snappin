import { createTRPCRouter, orgProcedure, } from "@snappin/features/trpc/_trpc";
import { ScanPastInvoicesSchema } from "./scanPastInvoice.schema"
import { scanPastInvoices } from "./scanPastInvoice.handler"
import { getScans, GetScans } from "./getScans.handler";

export const scanPastInvoiceRouter = createTRPCRouter({
  scanPastInvoices: orgProcedure
    .input(ScanPastInvoicesSchema)
    .mutation(async ({ ctx, input }) => scanPastInvoices({ ctx, input })),
  getScans: orgProcedure.query(async (opts: GetScans) => getScans(opts))
})