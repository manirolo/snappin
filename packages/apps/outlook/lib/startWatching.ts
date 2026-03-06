import { StartWatchingProps, StartWatchingResponse } from "../../appRegistry.interface";
import { getOutlookClient } from "../outlook.client";
import { outlookConfig } from "../outlook.config";
import { getAccessToken } from "./getAccessToken"

export async function startWatching({
    integration,
}: StartWatchingProps): Promise<StartWatchingResponse> {

    const { accessToken } = await getAccessToken({ integration })

    const client = getOutlookClient(accessToken);

    // Subscriptions expire max ~4230 minutes (~70 hours)
    const expirationDateTime = new Date(Date.now() + 60 * 60 * 1000 * 48).toISOString(); // 48 hours

    const res = await client.api("/subscriptions").post({
        changeType: "created",
        notificationUrl: outlookConfig.notificationUrl,
        resource: "me/messages",
        expirationDateTime,
        clientState: integration?._id?.toString(),
    });

    return {
        subscriptionId: res.id,
        expiresAt: res.expirationDateTime,
    };
}
