import { StartWatchingProps, StartWatchingResponse } from "../../appRegistry.interface";
import { getOutlookClient } from "../outlook.client";
import { outlookConfig } from "../outlook.config";

export async function startWatching({
    accessToken,
}: StartWatchingProps): Promise<StartWatchingResponse> {
    const client = getOutlookClient(accessToken);

    // Subscriptions expire max ~4230 minutes (~70 hours)
    const expirationDateTime = new Date(Date.now() + 60 * 60 * 1000 * 48).toISOString(); // 48 hours

    console.log("Notification URL:", outlookConfig.notificationUrl);

    const res = await client.api("/subscriptions").post({
        changeType: "created",
        notificationUrl: outlookConfig.notificationUrl,
        resource: "me/messages",
        expirationDateTime,
        clientState: "secureRandomString",
    });

    return {
        subscriptionId: res.id,
        expiresAt: res.expirationDateTime,
    };
}
