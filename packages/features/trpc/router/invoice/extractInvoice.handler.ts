import { SnappinError } from "@snappin/lib/error/snappin.error"
import { ContextProps } from "../../_trpc"
import { TExtractInvoice, TExtractInvoiceResponse } from "./extractInvoice.schema"
import { invoiceExtractService } from "@snappin/features/invoice/services/invoiceExtract.service"
import { invoiceSaveService } from "@snappin/features/invoice/services/invoiceSave.service"
import { TRPCError } from "@trpc/server"
import { assertResourceAccess } from "../../lib/assertResourceAccess"

export type ExtractInvoice = {
    ctx: ContextProps
    input: TExtractInvoice
}

export async function extractInvoice({ ctx, input }: ExtractInvoice): Promise<TExtractInvoiceResponse> {
    const extractionRequest = await ctx.db.invoiceExtractionRequest
        .findOne({ _id: input.requestId })
        .lean()

    if (!extractionRequest) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Extraction request not found" })
    }

    await assertResourceAccess({
        userId: ctx.userId,
        orgId: ctx.orgId,
        resourceOwnerId: extractionRequest.userId.toString(),
    })

    if (extractionRequest.status === "success") {
        throw new TRPCError({ code: "CONFLICT", message: "This request has already been processed" })
    }

    if (extractionRequest.status === "processing") {
        throw new TRPCError({ code: "CONFLICT", message: "This request is already being processed" })
    }

    const extractInvoice = await invoiceExtractService.extract(input.requestId);

    if (!extractInvoice) {
        throw new SnappinError("Invoice extraction failed", "ocr_engine_failed")
    }

    await invoiceSaveService.save(extractInvoice)
    return { message: "Invoice extraction success", vendorName: extractInvoice.vendor?.name ?? "" }
}