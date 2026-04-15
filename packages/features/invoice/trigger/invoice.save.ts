
import { ZInvoiceSave } from "./invoice.save.schema";
import { schemaTask } from "@trigger.dev/sdk";

export const invoiceSave = schemaTask({
    id: "invoice.save",
    schema: ZInvoiceSave,
    run: async (payload) => {
        const { invoiceSaveService } = await import("../services/invoiceSave.service");
        await invoiceSaveService.save(payload)
    }
})
