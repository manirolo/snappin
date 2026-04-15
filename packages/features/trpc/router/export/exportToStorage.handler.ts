import { TRPCError } from "@trpc/server";
import { ContextProps } from "../../_trpc"
import { TExportToStorage } from "./exportToStorage.schema"
import { AppCategory } from "@snappin/shared/apps/app.schema";
import { StorageIntegrationResource } from "@snappin/shared/integration/integration.schema";
import { storageExportService } from "@snappin/features/export/services/storageExport.service";

export type ExportToStorage = {
    ctx: ContextProps,
    input: TExportToStorage
}

export async function exportToStorage({ ctx, input }: ExportToStorage) {
    const integration = await ctx.db.integration.findOne({ _id: input.integrationId });

    if (!integration || !integration.appSlug || !integration.appCategory) {
        throw new TRPCError({ message: "Integration not found", code: "NOT_FOUND" })
    }

    if (integration.appCategory !== AppCategory.STORAGE) {
        throw new TRPCError({ message: "Selected integration is not a storage provider", code: "BAD_REQUEST" })
    }

    const storageIntegration = integration as unknown as StorageIntegrationResource

    if (!storageIntegration.metadata?.storageFolderId) {
        throw new TRPCError({ message: "Storage folder is not configured. Please update your integration settings", code: "PRECONDITION_FAILED" })
    }

    if (!storageIntegration.metadata?.organization?.strategy) {
        throw new TRPCError({ message: "Storage organization strategy is not configured. Please update your integration settings", code: "PRECONDITION_FAILED" })
    }

    try {
        const invoice = await ctx.db.invoice.findOne({ _id: input.invoiceId }).lean()
            .populate("vendor").populate("extraction");

        const organization = await ctx.db.organization.findOne({ clerkOrgId: ctx.orgId })

        if (!invoice) {
            throw new TRPCError({ message: "Invoice not found", code: "NOT_FOUND" })
        }

        if (!invoice.extraction?.documentId || !invoice.extraction?.fileName) {
            throw new TRPCError({ message: "Invoice document is not ready for export", code: "PRECONDITION_FAILED" })
        }

        if (!invoice.invoiceDate) {
            throw new TRPCError({ message: "Invoice date is missing, cannot organize document", code: "PRECONDITION_FAILED" })
        }

        const result = await storageExportService.export({
            integration: storageIntegration,
            documentId: invoice.extraction.documentId,
            fileName: invoice.extraction.fileName,
            invoiceDate: invoice.invoiceDate,
            invoiceId: invoice.invoiceId ?? null,
            vendor: invoice.vendor?.name ?? null,
            total: invoice.totals?.total ?? null,
            currency: invoice.totals?.currency ?? null,
            fileNameFormat: organization?.preference?.invoiceFileNameFormat ?? null,
        });
        await ctx.db.invoice.updateOne(
            { _id: invoice._id },
            { $push: { integrations: { ...result, error: null } } }
        );
    }
    catch (error) {
        if (error instanceof TRPCError) throw error

        console.error("[exportToStorage] unexpected error:", error)
        throw new TRPCError({
            message: "Something went wrong while exporting",
            code: "INTERNAL_SERVER_ERROR",
            cause: error
        })
    }


}