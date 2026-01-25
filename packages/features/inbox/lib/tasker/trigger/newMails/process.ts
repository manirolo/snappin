import { schemaTask } from "@trigger.dev/sdk"
import { ZNewMailTaskSchema } from "./schema"
import { EmailApps } from "@snappin/apps/appRegistry.interface";
import pLimit from "p-limit";

export const processNewMails = schemaTask({
  id: "process-new-mails",
  machine: "medium-1x",
  schema: ZNewMailTaskSchema,
  run: async (payload) => {

    const { connectDB } = await import("@snappin/db/connect");
    const { EmailAppsStore } = await import("@snappin/apps/appRegistry")

    const { db } = await import("@snappin/db/index");
    const { classifyThisMail } = await import("@snappin/features/ai/classification/mail");
    const { uploadInvoice } = await import("@snappin/infra/google/storage");
    const { extractInvoiceData } = await import("@snappin/features/ocr/extractInvoiceData");

    // Connect DB for operation
    connectDB();

    const app = EmailAppsStore[payload.appSlug] as EmailApps

    const integration = await db.integration.findOne({ identifierEmail: payload.emailAddress })

    if (!integration) {
      return
    }

    const { accessToken } = await app.getAccessToken({ integration });

    /**
     * Stage 1: History Id -> Emails
     * 
     * You have to get all emails since last history id 
     * pass those all emails for AI analyzes
     */

    // Stage 1.1: Get all messageIds by supplying HistoryId
    let messageIds: string[] = []
    if (integration.mailHistoryId) {
      messageIds = await app.getMessageIdsByHistoryId({ emailAddress: payload.emailAddress, lastHistoryId: integration.mailHistoryId, accessToken })
    }

    // NOTE: $max not sure what it does. But we need it
    // We need to update mailHistoryId by new HistoryId
    await db.integration.findOneAndUpdate({ _id: integration._id }, { $max: { mailHistoryId: payload.historyId } })

    const limit = pLimit(3)
    console.log("We got messageIds. Proceeding to extract email and invoice data")
    await Promise.all(
      messageIds.map(async (messageId) =>
        limit(async () => {
          // Stage 1.2: Get all emails by supplying messageIds
          const { subject, from, snippet, bodyText, attachments } = await app.getEmailByMessageId({ accessToken, messageId });

          /**
           * Stage 2: Email Classification (AI)
           * 
           * Determine whether the emails is TRANSACTIONAL or INVOICE or RECEIPT mail
           * also suggest the category of the document i.e food, travel
           */

          // Stage 2.1: AI analyzes and classification
          if (attachments.length <= 0) return
          const { category, isRefund } = await classifyThisMail({ subject, from, snippet, bodyText, attachments })

          /**
           * Stage 3: Attachment Text Extraction
           * 
           * Here we extract printed data in PDF and images.
           * if category not OTHER then we are going to extract data
           */

          if (category !== "OTHER") {
            // Stage 3.1: Store the invoice in GCP Cloud Storage

            await Promise.all(
              attachments.filter(a => a?.buffer)
                .map(async (attachment) => {
                  if (!attachment.buffer) return
                  console.log("Extracting data...")
                  const {
                    invoiceNumber,
                    invoiceDate,
                    supplierName,
                    supplierAddress,
                    taxAmount,
                    totalAmount,
                    currency
                  } = await extractInvoiceData(attachment.buffer, attachment.mimeType)

                })
            )
            // Stage 3.2: Use GCP Document Ai for extraction
          }
        })
      )
    )

  }

  /**
   * Stage 4: Storage + Persistence
   */

  // Stage 4.1: Store in S3

  // Stage 4.2: Create invoice record

},
)
