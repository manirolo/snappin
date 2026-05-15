import { schemaTask } from "@trigger.dev/sdk";
import { ZMailNotificationSchema } from "./mail.received.schema";
import { invoiceExtractRequest } from "@snappin/features/invoice/trigger/invoice.extractRequest";
import { userRepository } from "@snappin/features/user/repository/user.repository";
import { SourceKind } from "@snappin/shared/apps/app.schema";

export const mailReceived = schemaTask({
    id: "mail.received.task",
    schema: ZMailNotificationSchema,
    run: async (payload) => {
        const [{ resend }] = await Promise.all([
            import('../../config/resend'),
        ])

        const user = await userRepository.getUserByEmail(payload.from)

        if (!user) {
            await resend.emails.send({
                from: 'Snappin Automation <receipts@m.snappinapp.com>',
                to: payload.from,
                subject: `Re: ${payload.subject}`,
                html: "We couldn't find your account. Please send us your receipts from a registered email address or create an account <a href='https://www.snappinapp.com/signup'>here</a>",
                headers: {
                    'In-Reply-To': payload.messageId
                }
            })
            return
        }

        // ✅ Fix 1: Guard against undefined clerkUserId before proceeding
        if (!user.clerkUserId) {
            console.error(`User ${payload.from} has no clerkUserId`);
            return;
        }

        const { data: attachments } = await resend.emails.receiving.attachments.list({
            emailId: payload.emailId,
        });

        if (!attachments?.data?.length) return;

        const resolvedAttachments = (
            await Promise.all(
                attachments.data.map(async (attachment) => {
                    const response = await fetch(attachment.download_url);
                    if (!response.ok) {
                        console.error(`Failed to download ${attachment.filename}`);
                        return null;
                    }
                    return {
                        kind: "buffer" as const,
                        buffer: Buffer.from(await response.arrayBuffer()),
                        mimeType: attachment.content_type ?? null,
                        fileName: attachment.filename ?? null,
                    };
                })
            )
        ).filter((a): a is NonNullable<typeof a> => a !== null);

        if (!resolvedAttachments.length) return;

        await invoiceExtractRequest.trigger({
            userId: user.clerkUserId,
            attachments: resolvedAttachments,
            source: {
                kind: SourceKind.MANUAL,
                metadata: {
                    uploadedBy: payload.from,
                },
            },
        });
    },
})