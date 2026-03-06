import { ListMessagesSinceProps, ListMessagesSinceResponse } from "../../appRegistry.interface";
import { getGmailClient } from "../gmail.client";
import { normalizeTimestamps } from "./normalizeTimestamps";

export async function listMessagesSince({ 
    accessToken, since, until, pageToken, limit = 500 
}: ListMessagesSinceProps): Promise<ListMessagesSinceResponse> {

    const gmail = getGmailClient(accessToken);

    if (!since) return { messageIds: [], hasMore: false };

    const afterDate = await normalizeTimestamps({ unixSeconds: since });
    const queryParts = [`after:${afterDate}`];

    if (until) {
        const beforeDate = await normalizeTimestamps({ unixSeconds: until });
        queryParts.push(`before:${beforeDate}`);
    }

    const res = await gmail.users.messages.list({
        userId: "me",
        q: queryParts.join(" "),
        maxResults: limit,
        pageToken: pageToken ?? undefined,
    });

    return {
        messageIds: res.data.messages?.map((m) => m.id!) ?? [],
        nextPageToken: res.data.nextPageToken ?? null,
        hasMore: !!res.data.nextPageToken,
        totalEstimate: res.data.resultSizeEstimate ?? null,
    };
}