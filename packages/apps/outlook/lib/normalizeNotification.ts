import { AppSlug } from "@snappin/shared/apps/app.enum";
import { NormalizeNotificationProps, NormalizeNotificationResponse } from "../../appRegistry.interface";

export async function normalizeNotification({ body }: NormalizeNotificationProps<AppSlug.OUTLOOK>): Promise<NormalizeNotificationResponse> {
    const notifications = body.value ?? [];

    return notifications.map((n) => ({
        provider: AppSlug.OUTLOOK,
        integrationKey: n.subscriptionId,
        cursor: null,
        messageId: n.resourceData?.id ?? null,
    }));
}
