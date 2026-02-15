import { ZMailClassification } from "./mail.classification.schema"
import { schemaTask } from "@trigger.dev/sdk";

export const mailClassification = schemaTask({
    id: "mail.classifying",
    schema: ZMailClassification,
    run: async (payload) => {

        const { classifyThisMail } = await import("../../../ai/classification/mail.classification.fn");
        const { invoiceExtract } = await import("../../../invoices/trigger/invoice.extract");
        const { logger } = await import("@snappin/lib/logger");

        if (!payload.source.mail?.attachments) {
            console.warn("No attachments skipping...")
            return
        }

        const { category } = await classifyThisMail({ subject: payload.source.mail.subject, from: payload.source.mail.from, snippet: payload.source.mail.snippet, body: payload.source.mail.body, attachments: payload.source.mail.attachments })

        if (category == "OTHER") {
            logger.info("Mail categorized as OTHER. Stopping extraction process")
            return
        }

        await invoiceExtract.trigger({ integration: payload.integration, source: payload.source })

    }
})
