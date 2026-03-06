import { SnappinError } from "@snappin/lib/error/snappin.error"
import { ContextProps } from "../../_trpc"
import { TExtractInvoice, TExtractInvoiceResponse } from "./extractInvoice.schema"
import { invoiceExtractService } from "@snappin/features/invoice/services/invoiceExtract.service"
import { invoiceSaveService } from "@snappin/features/invoice/services/invoiceSave.service"

export type ExtractInvoice = {
    ctx: ContextProps
    input: TExtractInvoice
}

export async function extractInvoice({ input }: ExtractInvoice): Promise<TExtractInvoiceResponse> {
    const extractInvoice = await invoiceExtractService.extract(input.requestId);
    
    if (!extractInvoice) {
        throw new SnappinError("Invoice extraction failed", "ocr_engine_failed")
    }

    await invoiceSaveService.save(extractInvoice)
    return { message: "Invoice extraction success", vendorName: extractInvoice.vendor?.name ?? "" }
}