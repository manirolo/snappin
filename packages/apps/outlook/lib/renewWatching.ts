import { RenewWatchingProps, RenewWatchingResponse } from "../../appRegistry.interface";
import { getOutlookClient } from "../outlook.client";

export async function renewWatching({
  accessToken,
  subscriptionId,
}: RenewWatchingProps): Promise<RenewWatchingResponse | undefined> {
  if (!subscriptionId) {
    return
  }
  const client = getOutlookClient(accessToken);

  const newExpiration = new Date(Date.now() + 60 * 60 * 1000 * 48).toISOString();

  const res = await client
    .api(`/subscriptions/${subscriptionId}`)
    .patch({
      expirationDateTime: newExpiration,
    });

  return {
    subscriptionId: res.id,
    subscriptionExpiresAt: res.expirationDateTime,
  };
}
