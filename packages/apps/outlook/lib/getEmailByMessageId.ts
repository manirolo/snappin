
import type { GetEmailByMessageId, GetEmailByMessageIdResponse, Options } from "../../appRegistry.interface";
import { getOutlookClient } from "../outlook.client";
import { logger } from "@snappin/lib/logger";
import { AttachmentResource } from "@snappin/shared/inbox/mail.schema";

export async function getEmailByMessageId(payload: GetEmailByMessageId, opt?: Options): Promise<GetEmailByMessageIdResponse | null> {

    if (!payload.accessToken) return null;

    const client = getOutlookClient(payload.accessToken);

    try {
        opt?.log && logger.info("Outlook Email Fetch: 🔄 Started");

        const message = await client
            .api(`/me/messages/${payload.messageId}`)
            .expand("attachments")
            .get();

        const attachments: AttachmentResource[] = [];

        if (message.attachments) {
            for (const att of message.attachments) {
                if (att["@odata.type"] === "#microsoft.graph.fileAttachment") {

                    const buffer = Buffer.from(att.contentBytes, "base64");

                    attachments.push({
                        fileName: att.name ?? null,
                        mimeType: att.contentType ?? null,
                        attachmentId: att.id,
                        buffer,
                    });
                }
            }
        }

        const email: GetEmailByMessageIdResponse = {
            subject: message.subject,
            from: message.from?.emailAddress?.address,
            snippet: message.bodyPreview,
            body: message.body?.content ?? "",
            attachments,
        };

        opt?.log && logger.info("Outlook Email Fetch: ✅ Completed");

        return email;

    } catch (err) {
        opt?.log && logger.info("⚠️ Outlook fetch failed");
        logger.error(err);
        return null;
    }
}