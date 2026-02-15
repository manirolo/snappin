import { StopWatchingProps } from "../../appRegistry.interface";
import { getOutlookClient } from "../outlook.client";

export async function stopWatching({
    accessToken,
    subscriptionId,
}: StopWatchingProps & { subscriptionId: string }): Promise<void> {
    const client = getOutlookClient(accessToken);

    await client.api(`/subscriptions/${subscriptionId}`).delete();
}
