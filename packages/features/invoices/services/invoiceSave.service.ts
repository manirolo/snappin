import { TInvoiceSave } from "../trigger/invoice.save.schema";

export class InvoiceSaveService {
    async save(props: TInvoiceSave) {

        const { connectDB } = await import("@snappin/db/connect");
        const { db } = await import("@snappin/db/index");
        const { invoiceExtractionRequestService } = await import("./invoiceExtractionRequest.service");
        const { getVendorMatchFilter } = await import("../utils/matchFilter");
        const { createInvoice } = await import("../utils/createInvoice");
        const { ZExtractionStatus } = await import("@snappin/shared/invoiceExtractRequest/invoiceExtractionRequest.schema");
        const { getUnixSeconds } = await import("@snappin/lib/date/unixSeconds");
        const { documentService } = await import("./invoiceDocument.service");

        await connectDB()

        const request = await invoiceExtractionRequestService.getRequest({ extractionRequestId: props?.invoiceExtractionRequestId })

        if (!request) return

        const matchFilter = getVendorMatchFilter({ userId: request.userId, orgId: request.orgId, vendor: props?.vendor });

        const vendorInDB = matchFilter
            ? await db.vendor.findOneAndUpdate(
                matchFilter,
                {
                    $set: { ...props.vendor },
                    $setOnInsert: { userId: request.userId, orgId: request.orgId }
                },
                { upsert: true, new: true }
            )
            : props.vendor?.name  // no unique key — create fresh
                ? await db.vendor.create({
                    ...props.vendor,
                    userId: request.userId,
                    orgId: request.orgId,
                })
                : null



        // create invoice record in db
        const invoice = props?.invoice;
        if (!invoice) return;

        await createInvoice({
            userId: request.userId,
            orgId: request?.orgId,
            extractionId: props.invoiceExtractionRequestId,
            vendorId: vendorInDB?._id?.toString(),  
            invoiceId: invoice.invoiceId,
            invoiceDate: invoice.invoiceDate,
            dueDate: invoice.dueDate,
            description: invoice.description,
            recipient: invoice.recipient,
            subTotal: invoice.subTotal,
            tax: invoice.tax,
            total: invoice.total,
            currency: invoice.currency,
            lineItems: invoice.lineItems,
            payment: invoice.payment,
            metadata: invoice.metadata ?? { documentType: "invoice" },  
        })

        const { fileId } =
            await documentService.promote({
                tempFileId: request.documentId,
                userId: request.userId,
                fileName: request.fileName ?? `${Date.now()}_${crypto.randomUUID()}`,
            })

        await invoiceExtractionRequestService.updateRequest(props.invoiceExtractionRequestId, {
            invoiceId: props.invoice?.invoiceId,
            status: ZExtractionStatus.options[2],
            completedAt: getUnixSeconds(),
            ocrEngine: props.extraction.ocrEngine,
            analyzeEngine: props.extraction.analyzeEngine,
            documentId: fileId,
        })

    }
}

export const invoiceSaveService = new InvoiceSaveService()