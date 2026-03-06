import { createTRPCRouter, protectedProcedure } from "../../../_trpc";
import { updateInvoiceTotal, UpdateInvoiceTotal } from "./updateInvoiceTotal.handler";
import { ZUpdateInvoiceTotal } from "./updateInvoiceTotal.schema";

export const invoiceUpdateRouter = createTRPCRouter({
    total: protectedProcedure.input(ZUpdateInvoiceTotal).mutation(async (opts: UpdateInvoiceTotal) => updateInvoiceTotal(opts))
})