import { StartWatchingProps, StartWatchingResponse } from "../../appRegistry.interface";
import { getOutlookClient } from "../outlook.client";

export async function startWatching({
    accessToken,
}: StartWatchingProps): Promise<StartWatchingResponse> {
    const client = getOutlookClient(accessToken);

    // Subscriptions expire max ~4230 minutes (~70 hours)
    const expirationDateTime = new Date(Date.now() + 60 * 60 * 1000 * 48).toISOString(); // 48 hours

    const res = await client.api("/subscriptions").post({
        changeType: "created",
        notificationUrl: "https://yourdomain.com/api/webhook/outlook",
        resource: "me/messages",
        expirationDateTime,
        clientState: "secureRandomString",
    });

    return {
        subscriptionId: res.id,
        expiresAt: res.expirationDateTime,
    };
}
