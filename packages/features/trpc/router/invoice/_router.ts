import { createTRPCRouter, protectedProcedure } from "../../_trpc";
import { deleteInvoice, DeleteInvoice } from "./delete.handler";
import { ZDeleteInvoice } from "./delete.schema";
import { getAllInvoices, GetInvoice } from "./getInvoice.handler";
import { ZGetInvoices } from "./getInvoice.schema";
import { updateInvoice, UpdateInvoice } from "./update.handler";
import { updateVendor, UpdateVendor } from "./updateVendor.handler";
import { extractInvoice, ExtractInvoice } from "./extractInvoice.handler";
import { ZExtractInvoice } from "./extractInvoice.schema";
import { ZUpdateVendor } from "./updateVendor.schema";
import { invoiceProcessingStatus, InvoiceProcessStatus } from "./invoiceProcessStatus.handler";
import { ZUploadTempInvoice } from "./uploadTempInvoice.schema";
import { uploadTempInvoice, UploadTempInvoice } from "./uploadTempInvoice.handler";
import { ZBulkInvoiceDelete } from "./bulkActions/bulkInvoiceDelete.schema";
import { bulkInvoiceDelete, BulkInvoiceDelete } from "./bulkActions/bulkInvoiceDelete.handler";
import { getQueryParams, GetQueryParams } from "./getQueryParams.handler";
import { ZGetInvoiceData } from "./getInvoiceData.schema";
import { getInvoiceData, GetInvoiceData } from "./getInvoiceData.handler";
import { GetInvoiceDocumentUrl, getInvoiceDocumentUrl } from "./getInvoiceDocumentUrl.handler";
import { ZGetInvoiceDocumentUrl } from "./getInvoiceDocumentUrl.schema";
import { ZUpdateInvoice } from "./update.schema";
import { GetInvoiceThumbnailUrl, getInvoiceThumbnailUrl } from "./getInvoiceThumbnailUrl.handler";
import { ZGetInvoiceThumbnailUrl } from "./getInvoiceThumbnailUrl.schema";
import { invoiceUpdateRouter } from "./update/_router";

export const invoiceRouter = createTRPCRouter({
    getInvoices: protectedProcedure.input(ZGetInvoices).query(async (opts: GetInvoice) => {
        return getAllInvoices(opts)
    }),
    getInvoice: protectedProcedure.input(ZGetInvoiceData).query(async (opts: GetInvoiceData) => {
        return getInvoiceData(opts)
    }),
    getInvoiceDocumentUrl: protectedProcedure.input(ZGetInvoiceDocumentUrl).query(async (opts: GetInvoiceDocumentUrl) => {
        return getInvoiceDocumentUrl(opts)
    }),
    getInvoiceThumbnailUrl: protectedProcedure.input(ZGetInvoiceThumbnailUrl).query(async (opts: GetInvoiceThumbnailUrl) => getInvoiceThumbnailUrl(opts)),
    updateVendor: protectedProcedure.input(ZUpdateVendor).mutation(async (opts: UpdateVendor) => {
        return updateVendor(opts)
    }),
    uploadTempInvoice: protectedProcedure.input(ZUploadTempInvoice).mutation(async (opts: UploadTempInvoice) => {
        return uploadTempInvoice(opts)
    }),
    extractInvoice: protectedProcedure.input(ZExtractInvoice).mutation(async (opts: ExtractInvoice) => {
        return extractInvoice(opts)
    }),
    invoiceProcessingStatus: protectedProcedure.query(async (opts: InvoiceProcessStatus) => {
        return invoiceProcessingStatus(opts)
    }),
    deleteInvoice: protectedProcedure.input(ZDeleteInvoice).mutation(async (opts: DeleteInvoice) => {
        return deleteInvoice(opts)
    }),
    getQueryParams: protectedProcedure.query(async (opts: GetQueryParams) => {
        return getQueryParams(opts)
    }),
    updateInvoice: protectedProcedure.input(ZUpdateInvoice).mutation(async(opts: UpdateInvoice) => updateInvoice(opts)),
    
    update: invoiceUpdateRouter,
    
    // Bulk Actions
    bulkInvoiceDelete: protectedProcedure.input(ZBulkInvoiceDelete).mutation(async (opts: BulkInvoiceDelete) => {
        return bulkInvoiceDelete(opts)
    })
})