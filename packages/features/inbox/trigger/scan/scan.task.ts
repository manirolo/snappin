import { schedules } from "@trigger.dev/sdk"
import pLimit from "p-limit";
import { env } from "@snappin/env";
import { AppCategory, AppType } from "@snappin/shared/apps/app.enum";
import { IntegrationStatus } from "@snappin/shared/integration/status.enum";

export const mailReceived = schedules.task({
    id: "scan-1hr",
    machine: "medium-1x",
    cron: env.env == "development" ?
        {
            // You can change this time as you want but before pushing to repo
            // you need set as 10 mins 
            pattern: "*/2 * * * *",
            timezone: "Asia/Calcutta"
        } :
        {
            pattern: "* */1 * * *",
            timezone: "Asia/Calcutta"
        },
    run: async () => {

        const { connectDB } = await import("@snappin/db/connect");
        const { EmailAppsStore } = await import("@snappin/apps/appRegistry")
        const { db } = await import("@snappin/db/index");
        const { mailClassification } = await import("../../../ai/trigger/classification/mail.classification");
        const { logger } = await import("@snappin/lib/logger");

        // Connect DB for operation
        connectDB();


        const integrations = await db.integration.find({ appCategory: AppCategory.EMAIL, appType: AppType.SOURCE, status: IntegrationStatus.ACTIVE });

        if (!integrations) {
            return
        }

        // 🔥 Generate scan window
        const SCAN_WINDOW_MINUTES = 90;
        const SAFETY_BUFFER_MINUTES = 5;

        const totalMinutes = SCAN_WINDOW_MINUTES + SAFETY_BUFFER_MINUTES;

        // canonical internal format = unix seconds
        const since = Math.floor(
            (Date.now() - totalMinutes * 60 * 1000) / 1000
        );

        for (const integration of integrations) {
            const app = EmailAppsStore[integration.appSlug]
            const { accessToken } = await app.getAccessToken({ integration });

            /**
             * History Id -> Emails
             * 
             * You have to get all emails since last history id 
             * pass those all emails for AI analyzes
             */

            // Get all messageIds by supplying HistoryId
            const { messageIds } = await app.listMessagesSince({ accessToken, since });

            // NOTE: $max not sure what it does. But we need it
            // We need to update mailHistoryId by new HistoryId we got from webhook

            const limit = pLimit(3);

            await Promise.all(

                messageIds.map(async (messageId) =>

                    limit(async () => {
                        // Get all emails by supplying messageIds
                        const { subject, from, snippet, body, attachments } = await app.getEmailByMessageId({ accessToken, messageId }, { log: true });

                        /**
                         * Email Classification (AI)
                         * 
                         * Determine whether the emails is TRANSACTIONAL or INVOICE or RECEIPT mail
                         * also suggest the category of the document i.e food, travel
                         */

                        // Stage 2.1: AI analyzes and classification
                        if (attachments && attachments.length <= 0) {

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
    }
})
