import { SourceKind } from "@snappin/shared/apps/app.schema";
import { ZMailClassification } from "./mail.classification.schema"
import { schemaTask } from "@trigger.dev/sdk";

export const mailClassification = schemaTask({
    id: "mail.classification",
    schema: ZMailClassification,
    run: async (payload) => {

        const { classifyThisMail } = await import("../../../snappinAI/services/classification.service");
        const { invoiceExtractRequest } = await import("../../../invoice/trigger/invoice.extractRequest");
        const { logger } = await import("@snappin/lib/logger");

        if (payload.source.kind == SourceKind.INTEGRATION && payload.source.metadata) {
            const { category } = await classifyThisMail({ subject: payload.source.metadata.subject, from: payload.source.metadata.from, snippet: payload.source.metadata.snippet, body: payload.source.metadata.body, attachments: payload.source.metadata.attachments })

            if (category == "OTHER") {
                logger.info("Mail categorized as OTHER. Stopping extraction process")
                return
            }


            await invoiceExtractRequest.trigger(payload)

        }
    }
})
