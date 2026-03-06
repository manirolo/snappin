import { ZMailNotificationSchema } from "./mail.received.schema"
import { AppSlug } from "@snappin/shared/apps/app.schema";
import { schemaTask } from "@trigger.dev/sdk";

export const mailReceived = schemaTask({
    id: "mail.received",
    schema: ZMailNotificationSchema,
    run: async (payload) => {
        const { connectDB } = await import("@snappin/db/connect");
        const { EmailAppsStore } = await import("@snappin/apps/appRegistry")
        const { db } = await import("@snappin/db/index");
        const { mailService } = await import("../../services/mail.service");
        const { mailClassification } = await import("./mail.classification.task");

        const { provider, integrationKey, cursor, messageId } = payload;

        await connectDB();

        const app = EmailAppsStore[provider];
        const integration = await app.getIntegrationData({ integrationKey })

        if (!integration) {
            console.warn("Integration not found for:", integrationKey);
            return;
        }

        if (!integration.userId) {
            console.warn("User not found on integration data")
            return
        }

        const { messageIds, nextHistoryId } = await app.resolveMessageIds({ integration, historyId: cursor, messageId });

        if (integration.appSlug == AppSlug.GMAIL) {
            await db.integration.findOneAndUpdate({ _id: integration._id }, { $max: { "config.historyId": nextHistoryId } })
        }


        const payloads = await mailService.processMails({ integration, messageIds });

        await Promise.all(payloads.map((payload) => mailClassification.trigger(payload)));
    }
})
