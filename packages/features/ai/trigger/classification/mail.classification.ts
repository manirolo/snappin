import { schemaTask } from "@trigger.dev/sdk"
import { ZMailClassification } from "./mail.classification.schema"
import { invoiceExtract } from "../../../invoices/trigger/invoice.extract";

export const mailClassification = schemaTask({
    id: "mail-classifying",
    machine: "medium-1x",
    schema: ZMailClassification,
    run: async (payload) => {

        const { classifyThisMail } = await import("../../classification/mail.classification.fn");
        const { logger } = await import("@snappin/lib/logger");

        if (!payload.source.mail?.attachments) return

        const { category, isRefund } = await classifyThisMail({ subject: payload.source.mail.subject, from: payload.source.mail.from, snippet: payload.source.mail.snippet, body: payload.source.mail.body, attachments: payload.source.mail.attachments }, { log: true })

        if (category == "OTHER") {
            logger.info("Mail categorized as OTHER. Stopping extraction process")
            return
        }

        await invoiceExtract.trigger({ integration: payload.integration, source: payload.source })
       
    }
})
