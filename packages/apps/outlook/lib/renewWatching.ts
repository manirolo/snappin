import { RenewWatchingProps, RenewWatchingResponse } from "../../appRegistry.interface";
import { getOutlookClient } from "../outlook.client";

export async function renewWatching({
  accessToken,
  subscriptionId,
}: RenewWatchingProps & { subscriptionId: string }): Promise<RenewWatchingResponse> {
  const client = getOutlookClient(accessToken);

  const newExpiration = new Date(Date.now() + 60 * 60 * 1000 * 48).toISOString();

  const res = await client
    .api(`/subscriptions/${subscriptionId}`)
    .patch({
      expirationDateTime: newExpiration,
    });

  return {
    subscriptionId: res.id,
    expiresAt: res.expirationDateTime,
  };
}
