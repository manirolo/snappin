import { StopWatchingProps } from "../../appRegistry.interface";
import { getOutlookClient } from "../outlook.client";
import { getAccessToken } from "./getAccessToken"
import { AppSlug } from "@snappin/shared/apps/app.schema";

export async function stopWatching({
    integration
}: StopWatchingProps): Promise<void> {

    const { accessToken } = await getAccessToken({ integration })

    const client = getOutlookClient(accessToken);
    if (integration.config && integration?.appSlug == AppSlug.OUTLOOK && integration?.config?.subscriptionId) {
        try {
            // List ALL active subscriptions and delete every one
            // This handles cases where subscriptionId is missing/stale
            const { value: subscriptions } = await client.api("/subscriptions").get();

            if (subscriptions?.length) {
                await Promise.all(
                    subscriptions.map((sub: { id: string }) =>
                        client.api(`/subscriptions/${sub.id}`).delete().catch((err) => {
                            console.warn(`[stopWatching] Failed to delete subscription ${sub.id}:`, err)
                        })
                    )
                );
            }
        } catch (err) {
            console.warn("[stopWatching] Failed to list subscriptions:", err)
        }
    }
}
