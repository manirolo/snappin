import { createTRPCRouter, protectedProcedure } from "../../_trpc";
import { deleteInvoice, DeleteInvoice } from "./delete.handler";
import { ZDeleteInvoice } from "./delete.schema";
import { getAllInvoices, GetInvoice } from "./getInvoice.handler";
import { ZGetInvoices } from "./getInvoice.schema";
import { updateInvoice, UpdateInvoice } from "./update.handler";
import { updateVendor, UpdateVendor } from "./updateVendor.handler";
import { ZUpdateVendor } from "./updateVendor.schema";

export const invoiceRouter = createTRPCRouter({
    getInvoices: protectedProcedure.input(ZGetInvoices).query(async (opts: GetInvoice) => {
        return getAllInvoices(opts)
    }),
    updateInvoice: protectedProcedure.mutation(async (opts: UpdateInvoice) => {
        return updateInvoice(opts)
    }),
    updateVendor: protectedProcedure.input(ZUpdateVendor).mutation(async (opts: UpdateVendor) => {
        return updateVendor(opts)
    }),
    deleteInvoice: protectedProcedure.input(ZDeleteInvoice).mutation(async (opts: DeleteInvoice) => {
        return deleteInvoice(opts)
    })
})