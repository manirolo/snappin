import { VendorResource } from "@snappin/shared/vendor/vendor.schema";
import { TInvoiceSave } from "../trigger/invoice.save.schema";
import { InvoiceResource, LineItemsResource } from "@snappin/shared/invoice/invoice.schema";
import type { InvoiceData } from "@snappinhq/doc-ai";

type Payment = NonNullable<InvoiceResource["payment"]>;
type Subscription = NonNullable<NonNullable<InvoiceResource["metadata"]>["subscription"]>;

function mapDocToResources(doc: InvoiceData): {
    vendor: VendorResource;
    invoice: Omit<InvoiceResource, "userId" | "extractionId">;
} {
    const vendor: VendorResource = {
        name: doc.vendorName,
        businessRegistrationId: doc.vendorRegId,
        taxId: doc.vendorTaxId,
        email: doc.vendorEmail,
        phone: doc.vendorPhone,
        website: doc.vendorWebsite,
        address: doc.vendorAddress,
    };

    const lineItems: LineItemsResource[] | undefined = doc.lineItems?.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount,
        tax: {
            rate: item.taxRate,
            amount: item.tax,
        },
        total: item.total,
    }));

    const payment: Payment = {
        method: doc.paymentMethod as Payment["method"],
        terms: doc.paymentTerms,
        last4Digits: doc.paymentLast4Digits,
        status: doc.paymentStatus as Payment["status"],
    };

    const metadata: InvoiceResource["metadata"] = {
        documentType: doc.documentType,
        subscription: doc.billingFrequency || doc.nextBillingDate
            ? {
                isRecurring: !!doc.billingFrequency,
                frequency: doc.billingFrequency as Subscription["frequency"],
                nextBillingDate: doc.nextBillingDate,
            }
            : null,
    };

    const invoice: Omit<InvoiceResource, "userId" | "extractionId"> = {
        invoiceId: doc.invoiceId,
        invoiceDate: doc.invoiceDate,
        dueDate: doc.dueDate,
        description: doc.summary,

        recipient: {
            name: doc.clientName,
            email: doc.clientEmail,
            taxId: doc.clientTaxId,
            address: doc.clientAddress,
        },

        totals: {
            subtotal: doc.subtotal,
            discount: doc.discountAmount,
            tax: {
                rate: doc.taxRate,
                amount: doc.taxAmount,
            },
            total: doc.totalAmount,
            currency: doc.currency,
        },

        lineItems,
        payment,
        metadata,
    };

    return { vendor, invoice };
}

export class InvoiceExtractService {
    async extract(invoiceExtractionRequestId: string): Promise<TInvoiceSave | undefined> {

        const { connectDB } = await import("@snappin/db/connect");
        const { invoiceExtractionRequestService } = await import("./invoiceExtractionRequest.service");
        const { logger } = await import("@snappin/lib/logger");
        const { storageService } = await import("@snappin/infra/google/storage");
        const { ZExtractionStatus } = await import("@snappin/shared/invoiceExtractRequest/invoiceExtractionRequest.schema");
        const { getUnixSeconds } = await import("@snappin/lib/date/unixSeconds");
        const { SnappinError } = await import("@snappin/lib/error/snappin.error");
        const { snappinDocAI } = await import("../../config/snappinDocAI");
        const { handleInvoiceExtractionFailure } = await import("../utils/handleInvoiceExtractionFailure");

        connectDB();

        const request = await invoiceExtractionRequestService.getRequest({
            extractionRequestId: invoiceExtractionRequestId,
        });

        if (!request?.documentId) {
            logger.info("No attachments with buffer found, skipping extraction");
            throw new SnappinError("No attachment found with request id", "no_attachment_with_request");
        }

        try {
            const buffer = await storageService.download(request.documentId);

            await invoiceExtractionRequestService.updateRequest(invoiceExtractionRequestId, {
                attempts: request.attempts + 1,
                status: ZExtractionStatus.options[1],
                startedAt: getUnixSeconds(),
            });

            const expenseDocuments = await snappinDocAI.extract(new Uint8Array(buffer));

            if (!expenseDocuments.data || expenseDocuments.data.length === 0) {
                throw new SnappinError("Aws Textract responded with empty result", "ocr_empty_result");
            }

            for (const doc of expenseDocuments.data) {
                const { vendor, invoice } = mapDocToResources(doc);

                return {
                    invoice,
                    vendor,
                    invoiceExtractionRequestId,
                };
            }

        } catch (err) {
            await handleInvoiceExtractionFailure(err, request._id.toString());
        }
    }
}

export const invoiceExtractService = new InvoiceExtractService();