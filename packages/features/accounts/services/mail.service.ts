import pLimit from "p-limit";
import { EmailAppSlug, SourceKind } from "@snappin/shared/apps/app.schema";
import { IntegrationResource } from "@snappin/shared/integration/integration.schema";
import { EmailApps } from "@snappin/apps/appRegistry.interface";
import { TMailClassification } from "@snappin/features/inbox/trigger/mail/mail.classification.schema";

type ProcessMailOptions = {
    integration: IntegrationResource;
    scanId?: string;
    messageIds: string[];
    concurrency?: number;
}

type FetchMailOptions = {
    provider: EmailApps<EmailAppSlug>;
    integration: IntegrationResource;
    messageId: string;
}


export class MailService {

    /**
     * Fetches a single email and returns structured content + attachments
     */
    async fetchMail({ provider, integration, messageId }: FetchMailOptions) {
        const { accessToken } = await provider.getAccessToken({ integration });
        const email = await provider.getEmail({ accessToken, messageId });
        return email ?? null;
    }

    /**
     * Processes a batch of messageIds — fetches each mail and builds classification payloads.
     * Does NOT trigger tasks — returns payloads for the caller to trigger.
     */
    async processMails({ integration, messageIds, scanId, concurrency = 3 }: ProcessMailOptions): Promise<TMailClassification[]> {
        const { EmailAppsStore } = await import("@snappin/apps/appRegistry");
        const { logger } = await import("@snappin/lib/logger");

        const provider = EmailAppsStore[integration.appSlug as EmailAppSlug];
        const limit = pLimit(concurrency);
        const payloads: TMailClassification[] = [];

        await Promise.all(
            messageIds.map((messageId) =>
                limit(async () => {
                    const email = await this.fetchMail({ provider, integration, messageId });

                    if (!email) {
                        logger.warn("Failed to fetch email, skipping:", messageId);
                        return;
                    }

                    const { subject, from, senderName, to, receiverName, snippet, body, attachments } = email;

                    if (!attachments?.length) {
                        logger.info("No attachments found, skipping messageId:", messageId);
                        return;
                    }

                    const attachmentFromMail = attachments
                        .filter((a): a is typeof a & { buffer: Buffer } => a.buffer != null)
                        .map((a) => ({
                            kind: "buffer" as const,
                            buffer: Buffer.from(a.buffer),
                            mimeType: a.mimeType ?? null,
                            fileName: a.fileName ?? null,
                        }));

                    payloads.push({
                        userId: integration.userId ?? null,
                        orgId: integration.orgId ?? null,
                        attachments: attachmentFromMail,
                        source: {
                            kind: SourceKind.INTEGRATION,
                            integrationId: integration._id?.toString(),
                            externalId: messageId,
                            ...(scanId && {
                                isRetroactiveScan: true,
                                retroactiveScanId: scanId,
                            }),
                            metadata: { subject, from, to, senderName, receiverName, snippet, body },
                        }
                    });
                })
            )
        );

        return payloads;
    }
}

export const mailService = new MailService();