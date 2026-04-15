import { AppCategory } from "@snappin/shared/apps/app.schema";
import { TInvoiceSave } from "../trigger/invoice.save.schema";
import { StorageIntegrationResource } from "@snappin/shared/integration/integration.schema";
import { usageService } from "@snappin/features/billing/service/usage.service";

export class InvoiceSaveService {
    async save(props: TInvoiceSave) {

        const { connectDB } = await import("@snappin/db/connect");
        const { db } = await import("@snappin/db/index");
        const { invoiceExtractionRequestService } = await import("./invoiceExtractionRequest.service");
        const { getVendorMatchFilter } = await import("../utils/matchFilter");
        const { invoiceService } = await import("./invoice.service");
        const { ZExtractionStatus } = await import("@snappin/shared/invoiceExtractRequest/invoiceExtractionRequest.schema");
        const { getUnixSeconds } = await import("@snappin/lib/date/unixSeconds");
        const { storageExportService } = await import("@snappin/features/export/services/storageExport.service");
        const { documentService } = await import("./invoiceDocument.service");
        const { createFileName } = await import("@snappin/lib/file/fileName");

        await connectDB()

        const request = await invoiceExtractionRequestService.getRequest({ extractionRequestId: props?.invoiceExtractionRequestId })
        if (!request) return

        const organization = await db.organization.findOne({ clerkOrgId: request.orgId })

        const { vendor, invoiceExtractionRequestId, invoice } = props;

        const matchFilter = getVendorMatchFilter({ userId: request.userId, orgId: request.orgId, vendor: vendor });
        const format = organization?.preference?.invoiceFileNameFormat
        const resolvedFileName = format
            ? createFileName({
                format,
                date: invoice?.invoiceDate,
                vendor: vendor?.name,
                invoiceId: invoice?.invoiceId,
                amount: invoice?.totals?.total,
                currency: invoice?.totals?.currency
            })
            : createFileName({
                // fallback format when org has no preference set
                format: {
                    components: ["date", "vendor", "invoiceId"],
                    separator: "_",
                    dateFormat: "MMM_DD_YYYY",
                    uppercase: false,
                },
                date: invoice?.invoiceDate,
                vendor: vendor?.name,
                invoiceId: invoice?.invoiceId,
                amount: invoice?.totals?.total,
                currency: invoice?.totals?.currency,
            })

        const vendorInDB = matchFilter
            ? await db.vendor.findOneAndUpdate(
                matchFilter,
                {
                    $set: { ...vendor },
                    $setOnInsert: { userId: request.userId, orgId: request.orgId }
                },
                { upsert: true, returnDocument: "after" }
            )
            : vendor?.name
                ? await db.vendor.create({
                    ...vendor,
                    userId: request.userId,
                    orgId: request.orgId,
                })
                : null

        // create invoice record in db
        if (!invoice || !invoice.invoiceId) return;

        const invoiceRecord = await invoiceService.createInvoice({
            userId: request.userId,
            orgId: request?.orgId,
            extractionId: invoiceExtractionRequestId,
            vendorId: vendorInDB?._id?.toString(),
            invoiceId: invoice.invoiceId,
            invoiceDate: invoice.invoiceDate,
            dueDate: invoice.dueDate,
            description: invoice.description,
            recipient: invoice.recipient,
            totals: invoice.totals,
            lineItems: invoice.lineItems,
            payment: invoice.payment,
            metadata: invoice.metadata ?? { documentType: "invoice" },
        })

        if (!invoiceRecord) {
            throw new Error("Failed to create invoice record");
        }

        const { fileId } =
            await documentService.promote({
                tempFileId: request.documentId,
                userId: request.userId,
                orgId: request.orgId ?? crypto.randomUUID(),
                fileName: resolvedFileName ?? crypto.randomUUID(),
            })
        const storageIntegrations = await db.integration.find({
            orgId: request.orgId,
            appCategory: AppCategory.STORAGE,
            "config.storageFolderId": { $exists: true },
        });

        const org = await db.organization.findOne({ clerkOrgId: request.orgId })
        if (org?.clerkOrgId) {
            usageService.increment(org?.clerkOrgId, "invoices")
        }
        /// upload to storage integrations 
        if (storageIntegrations.length > 0) {
            await Promise.allSettled(
                storageIntegrations.map(async (integration) => {
                    try {
                        const result = await storageExportService.export({
                            integration: integration as unknown as StorageIntegrationResource,
                            documentId: fileId,
                            fileName: resolvedFileName ?? crypto.randomUUID(),
                            invoiceDate: invoice.invoiceDate ?? String(Date.now()),
                            invoiceId: invoice.invoiceId ?? null,
                            vendor: vendor?.name ?? null,
                            total: invoice.totals?.total ?? null,
                            currency: invoice.totals?.currency ?? null,
                            fileNameFormat: format ?? null,
                        });

                        await db.invoice.updateOne(
                            { _id: invoiceRecord?._id },
                            { $push: { integrations: { ...result, error: null } } }
                        );
                    } catch (error) {
                        console.error("Storage export failed for integration:", integration._id, error);
                    }
                })
            );
        }

        await invoiceExtractionRequestService.updateRequest(props.invoiceExtractionRequestId, {
            invoiceId: invoice?.invoiceId,
            status: ZExtractionStatus.options[2],
            completedAt: getUnixSeconds(),
            documentId: fileId,
            fileName: resolvedFileName ?? request.fileName,
        })

        return invoiceRecord

    }
}

export const invoiceSaveService = new InvoiceSaveService()