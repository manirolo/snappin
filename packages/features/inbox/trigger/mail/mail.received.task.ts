import { ZMailNotificationSchema } from "./mail.received.schema"
import pLimit from "p-limit";
import { AppSlug } from "@snappin/shared/apps/app.enum";
import { schemaTask } from "@trigger.dev/sdk";

export const mailReceived = schemaTask({
    id: "mail.received",
    schema: ZMailNotificationSchema,
    run: async (payload) => {
        const { connectDB } = await import("@snappin/db/connect");
        const { EmailAppsStore } = await import("@snappin/apps/appRegistry")
        const { logger } = await import("@snappin/lib/logger")
        const { db } = await import("@snappin/db/index");
        const { mailClassification } = await import("./mail.classification.task");

        const { provider, integrationKey, cursor, messageId } = payload;

        await connectDB();

        const app = EmailAppsStore[provider];
        const integration = await app.getIntegrationData({ integrationKey })

        if (!integration) {
            console.warn("Integration not found for:", integrationKey);
            return;
        }

        const { messageIds, nextHistoryId } = await app.resolveMessageIds({ integration, historyId: cursor, messageId });

        if (integration.appSlug == AppSlug.GMAIL) {
            await db.integration.findOneAndUpdate({ _id: integration._id }, { $max: { "config.historyId": nextHistoryId } })
        }


        const limit = pLimit(3);

        await Promise.all(

            messageIds.map(async (messageId) =>

                limit(async () => {

                    const { accessToken } = await app.getAccessToken({ integration })

                    // Get all emails by supplying messageIds
                    const email = await app.getEmail({ accessToken, messageId });

                    if (!email) {
                        logger.warn("Failed to fetch email:", messageId)
                        return
                    }

                    const { subject, from, snippet, body, attachments } = email
                    /**
                     * Email Classification (AI)
                     *
                     * Determine whether the emails is TRANSACTIONAL or INVOICE or RECEIPT mail
                     * also suggest the category of the document i.e food, travel
                     */

                    // Stage 2.1: AI analyzes and classification
                    if (!attachments || attachments.length === 0) {

                        logger.info("No attachments found in the mail. Skipping extraction for messageId: ", messageId)

                        return
                    }

                    await mailClassification.trigger({
                        integration,
                        source: {
                            slug: integration.appSlug,
                            category: integration.appCategory,
                            mail: {
                                subject,
                                from,
                                snippet,
                                body,
                                attachments
                            }
                        }
                    })
                }
            ))
        )
    }
})