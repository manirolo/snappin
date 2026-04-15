import { StopWatchingProps } from "../../appRegistry.interface";
import { getOutlookClient } from "../outlook.client";
import { getAccessToken } from "./getAccessToken";
import { AppSlug } from "@snappin/shared/apps/app.schema";
import { OutlookIntegration } from "@snappin/shared/integration/integration.schema";

export async function stopWatching({
    integration
}: StopWatchingProps): Promise<void> {

    const { accessToken } = await getAccessToken({ integration });

    const client = getOutlookClient(accessToken);

    if (integration?.appSlug === AppSlug.OUTLOOK) {
        const outlookIntegration = integration as OutlookIntegration;
        const subscriptionId = outlookIntegration.metadata?.subscriptionId;

        if (!subscriptionId) return;

        try {
            const { value: subscriptions } = await client.api("/subscriptions").get();

            if (subscriptions?.length) {
                await Promise.all(
                    subscriptions.map((sub: { id: string }) =>
                        client.api(`/subscriptions/${sub.id}`).delete().catch((err) => {
                            console.warn(`[stopWatching] Failed to delete subscription ${sub.id}:`, err);
                        })
                    )
                );
            }
        } catch (err) {
            console.warn("[stopWatching] Failed to list subscriptions:", err);
        }
    }
}