import { createTRPCRouter, orgProcedure } from "../../_trpc";
import { csvExport, CSVExport } from "./_csv.handler";
import { zipExport, ZipExport } from "./_zip.handler";
import { createBill, CreateBill } from "./createBill.handler";
import { ZCreateBill } from "./createBill.schema";
import { downloadPdf, DownloadPdf } from "./downloadPdf.handler";
import { ZDownloadPdf } from "./downloadPdf.schema";
import { ZExport } from "./export.schema";
import { exportToStorage, ExportToStorage } from "./exportToStorage.handler";
import { ZExportToStorage } from "./exportToStorage.schema";
import { GetAccounts, getAccounts } from "./getAccounts.handler";
import { ZGetAccounts } from "./getAccounts.schema";
import { getExportIntegrations, GetExportIntegrations } from "./getExportIntegrations.handler";

export const exportDocument = createTRPCRouter({
    csv: orgProcedure.input(ZExport).mutation(async (opts: CSVExport) => csvExport(opts)),
    zip: orgProcedure.input(ZExport).mutation(async (opts: ZipExport) => zipExport(opts)),
    downloadPdf: orgProcedure.input(ZDownloadPdf).mutation(async (opts: DownloadPdf) => downloadPdf(opts)),
    exportToStorage: orgProcedure.input(ZExportToStorage).mutation(async (opts: ExportToStorage) => exportToStorage(opts)),
    getExportIntegrations: orgProcedure.query(async (opts: GetExportIntegrations) => getExportIntegrations(opts)),
    getAccounts: orgProcedure.input(ZGetAccounts).query(async (opts: GetAccounts) => getAccounts(opts)),      
    createBill: orgProcedure.input(ZCreateBill).mutation(async (opts: CreateBill) => createBill(opts)),
})