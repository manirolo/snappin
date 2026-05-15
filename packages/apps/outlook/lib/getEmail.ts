
import type { GetEmail, GetEmailResponse } from "../../appRegistry.interface";
import { getOutlookClient } from "../outlook.client";
import { logger } from "@snappin/lib/logger";
import { AttachmentResource } from "@snappin/shared/inbox/mail.schema";

export async function getEmail(payload: GetEmail): Promise<GetEmailResponse | null> {
    if (!payload.accessToken) return null;

    const client = getOutlookClient(payload.accessToken);

    try {
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

        const email: GetEmailResponse = {
            subject: message.subject,
            from: message.from?.emailAddress?.address,
            senderName: message.from?.emailAddress?.name,
            to: message.toRecipients?.[0]?.emailAddress?.address,
            receiverName: message.toRecipients?.[0]?.emailAddress?.name,
            snippet: message.bodyPreview,
            body: message.body?.content ?? "",
            attachments,
        };

        return email;
    } catch (err) {
        logger.error(err);
        return null;
    }
}