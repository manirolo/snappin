import { TRPCError } from "@trpc/server";
import { ContextProps } from "../../_trpc";
import { TCreateBill } from "./createBill.schema";
import { AppCategory } from "@snappin/shared/apps/app.schema";
import { AnyAccountingProvider, resolveProvider } from "@snappin/apps/lib/resolveProvider";
import { mapInvoiceToBillProps } from "@snappin/apps/xero/utils/xero.mapper";
import { storageService } from "@snappin/infra/google/storage";
import { XeroIntegration } from "@snappin/shared/integration/integration.schema";

export type CreateBill = {
    ctx: ContextProps;
    input: TCreateBill;
};

export async function createBill({ ctx, input }: CreateBill) {
    const integration = await ctx.db.integration.findOne({ _id: input.integrationId }) as XeroIntegration;

    if (!integration || !integration.appSlug || !integration.appCategory) {
        throw new TRPCError({ message: "Integration not found", code: "NOT_FOUND" });
    }

    if (integration.appCategory !== AppCategory.ACCOUNTING) {
        throw new TRPCError({ message: "Selected integration is not an accounting provider", code: "BAD_REQUEST" });
    }

    if (!integration.metadata?.tenantId) {
        throw new TRPCError({ message: "Accounting organisation is not configured", code: "PRECONDITION_FAILED" });
    }

    const invoice = await ctx.db.invoice
        .findOne({ _id: input.invoiceId })
        .lean()
        .populate("vendor")
        .populate("extraction");

    if (!invoice) {
        throw new TRPCError({ message: "Invoice not found", code: "NOT_FOUND" });
    }

    if (!invoice.extraction?.documentId || !invoice.extraction?.fileName) {
        throw new TRPCError({ message: "Invoice document is not ready for export", code: "PRECONDITION_FAILED" });
    }

    const provider = resolveProvider(integration.appCategory, integration.appSlug) as AnyAccountingProvider;
    const { accessToken } = await provider.getAccessToken({ integration });

    try {
        const pdfBuffer = await storageService.download(invoice.extraction.documentId);

        const billProps = mapInvoiceToBillProps(
            invoice,
            {
                accessToken,
                tenantId: integration.metadata.tenantId,
            },
            {
                lineAmountType: input.lineAmountType,
                accountCode: input.accountCode,
                attachment: pdfBuffer ? {
                    buffer: pdfBuffer,
                    fileName: invoice.extraction.fileName,
                    mimeType: "application/pdf",
                } : null,
            }
        );

        const result = await provider.createBill(billProps);

        // ✅ Persist export metadata on invoice — same pattern as exportToStorage
        await ctx.db.invoice.updateOne(
            { _id: invoice._id },
            {
                $push: {
                    integrations: {
                        appSlug: integration.appSlug,
                        integrationId: integration._id?.toString(),
                        exportedAt: Date.now(),
                        externalId: result.billId,
                        url: result.url ?? null,
                        error: null,
                    },
                },
            }
        );

        return result; // { billId, invoiceNumber, status, url }

    } catch (error) {
        if (error instanceof TRPCError) throw error;
        console.error("[createBill] unexpected error:", error);
        throw new TRPCError({
            message: "Failed to create bill in accounting provider",
            code: "INTERNAL_SERVER_ERROR",
            cause: error,
        });
    }
}