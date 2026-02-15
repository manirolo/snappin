import { gmail_v1 } from "googleapis";
import type { GetEmail, GetEmailResponse } from "../../appRegistry.interface";
import { getGmailClient } from "../config";
import { logger } from "@snappin/lib/logger";
import { AttachmentResource } from "@snappin/shared/inbox/mail.schema";

export const getHeader = (name: string, headers: gmail_v1.Schema$MessagePartHeader[] | undefined) => headers?.find(h => h.name === name)?.value;

function extractMailBody(parts: gmail_v1.Schema$MessagePart[] = []): string {
    const decode = (data?: string): string => {
        if (!data) return ""
        const normalized = data.replace(/-/g, "+").replace(/_/g, "/")
        return Buffer.from(normalized, "base64").toString("utf-8")
    }

    for (const part of parts) {
        if (part.mimeType === "text/plain" && part.body?.data) {
            return decode(part.body.data)
        }

        if (part.mimeType === "text/html" && part.body?.data) {
            return decode(part.body.data)
        }

        if (part.parts) {
            const nested = extractMailBody(part.parts)
            if (nested) return nested
        }
    }

    return ""
}

function extractAttachments(parts: gmail_v1.Schema$MessagePart[] = []): AttachmentResource[] {

    const attachments: GetEmailResponse["attachments"] = []

    for (const part of parts) {
        if (part.filename && part.body?.attachmentId) {
            attachments.push({
                fileName: part.filename,
                mimeType: part.mimeType ?? "application/octet-stream",
                attachmentId: part?.body.attachmentId
            })
        }

        if (part.parts) {
            attachments.push(...extractAttachments(part.parts))
        }
    }

    return attachments
}

async function getAttachmentBuffer({ gmail, messageId, attachmentId }:
    {
        gmail: gmail_v1.Gmail;
        messageId: string;
        attachmentId?: string;
    }): Promise<Buffer> {

    const res = await gmail.users.messages.attachments.get({
        userId: "me",
        messageId,
        id: attachmentId,
    });

    const data = res.data.data ?? "";

    // Gmail uses base64url encoding
    const normalized = data.replace(/-/g, "+").replace(/_/g, "/");

    return Buffer.from(normalized, "base64");
}


export async function getEmail(payload: GetEmail): Promise<GetEmailResponse | null> {

    if (!payload.accessToken) return null;

    const gmail = getGmailClient(payload.accessToken);

    try {

        const { data } = await gmail.users.messages.get({
            userId: "me",
            id: payload.messageId,
            format: "full",
        });

        const headers = data.payload?.headers ?? [];

        // ✅ Always an array
        const rawAttachments = extractAttachments(data.payload?.parts) ?? [];

        const attachments = (
            await Promise.all(
                rawAttachments.map(async (attachment) => {
                    if (!attachment.attachmentId) return null;

                    const buffer = await getAttachmentBuffer({
                        gmail,
                        messageId: payload.messageId,
                        attachmentId: attachment.attachmentId,
                    });

                    const result: AttachmentResource = {
                        fileName: attachment.fileName ?? null,
                        mimeType: attachment.mimeType ?? null,
                        attachmentId: attachment.attachmentId,
                        buffer,
                    };

                    return result;
                })
            )
        ).filter(
            (a): a is AttachmentResource => a !== null
        ); 

        const email: GetEmailResponse = {
            subject: getHeader("Subject", headers),
            from: getHeader("From", headers),
            snippet: data.snippet,
            body: extractMailBody(data.payload?.parts),
            attachments: attachments,
        };

        return email;
    } catch (err) {
        logger.error(err);
        return null;
    }
}
