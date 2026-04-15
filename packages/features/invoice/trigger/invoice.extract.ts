import { ZInvoiceExtract } from "./invoice.extract.schema"
import { schemaTask } from "@trigger.dev/sdk";
import { invoiceExtractService } from "../services/invoiceExtract.service";

export const invoiceExtract = schemaTask({
    id: "invoice.extract",
    schema: ZInvoiceExtract,
    queue: {
        concurrencyLimit: 10
    },
    run: async (payload) => {
        const { invoiceSave } = await import("./invoice.save");

        const extractedInvoice = await invoiceExtractService.extract(payload.invoiceExtractionRequestId)
        
        if(!extractedInvoice) return
        
        await invoiceSave.trigger(extractedInvoice);
    }
})
