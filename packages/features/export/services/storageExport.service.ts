
import { AnyStorageProvider } from "@snappin/apps/lib/resolveProvider";
import { StorageIntegrationResource } from "@snappin/shared/integration/integration.schema";
import { InvoiceFileFormatPreference } from "@snappin/shared/organization/preference/invoiceFileFormatPreference.schema";
import { TRPCError } from "@trpc/server";

export type ExportToStorageProps = {
    integration: StorageIntegrationResource;
    documentId: string;
    fileName: string;
    invoiceDate: string;
    invoiceId?: string | null;
    vendor?: string | null;
    total?: number | null;
    currency?: string | null;
    fileNameFormat?: InvoiceFileFormatPreference | null;
};

export type ExportToStorageResult = {
    fileId: string;
    url: string | null;
    appSlug: string;
    integrationId: string;
    exportedAt: number;
};

export class StorageExportService {
    async export({
        integration,
        documentId,
        fileName,
        invoiceDate,
        invoiceId,
        vendor,
        total,
        currency,
        fileNameFormat,
    }: ExportToStorageProps): Promise<ExportToStorageResult> {
        const { resolveProvider } = await import("@snappin/apps/lib/resolveProvider");
        const { AppCategory } = await import("@snappin/shared/apps/app.schema");
        const { storageService } = await import("@snappin/infra/google/storage");
        const { extractDateParts } = await import("@snappin/lib/date/extract");
        const { getMimeType } = await import("@snappin/lib/file/getMimeType");
        const { createFileName } = await import("@snappin/lib/file/fileName");
        const { ReAuthRequiredError } = await import("@snappin/apps/googleDrive/lib/createFile");

        if (!integration.appSlug || !integration.appCategory || !integration?._id) {
            throw new Error("Integration is missing appSlug or appCategory");
        }

        if (integration.appCategory !== AppCategory.STORAGE) {
            throw new Error("Selected integration is not a storage provider");
        }

        if (!integration.metadata?.storageFolderId) {
            throw new Error("Storage folder is not configured. Please update your integration settings");
        }

        if (!integration.metadata?.organization?.strategy) {
            throw new Error("Storage organization strategy is not configured. Please update your integration settings");
        }

        const provider = resolveProvider(integration.appCategory, integration.appSlug) as AnyStorageProvider;
        const { accessToken } = await provider.getAccessToken({ integration });
        const buffer = await storageService.download(documentId);
        const { year } = extractDateParts(invoiceDate, ["year"]);
        const mimeType = await getMimeType(buffer);

        const resolvedFileName = fileNameFormat
            ? createFileName({
                format: fileNameFormat,
                date: invoiceDate,
                vendor: vendor ?? undefined,
                invoiceId: invoiceId ?? undefined,
                amount: total ?? undefined,
                currency: currency ?? undefined,
            })
            : fileName;

        try {
            const result = await provider.createFile({
                accessToken,
                rootFolderId: integration.metadata.storageFolderId,
                integrationId: integration?._id,
                fileName: resolvedFileName,
                mimeType,
                content: buffer,
                strategy: integration.metadata.organization.strategy,
                year: String(year),
                vendor: vendor ?? undefined,
                date: invoiceDate,
                invoiceId: invoiceId ?? undefined,
                amount: total ?? undefined,
                currency: currency ?? undefined,
            });

            return {
                fileId: result.fileId,
                url: result.fileUrl ?? null,
                appSlug: integration.appSlug,
                integrationId: String(integration._id),
                exportedAt: Date.now(),
            };
        } catch (error) {
            if (error instanceof ReAuthRequiredError) {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: error.message,
                    cause: { code: error.code },
                });
            }
            throw error;
        }
    }
}

export const storageExportService = new StorageExportService();