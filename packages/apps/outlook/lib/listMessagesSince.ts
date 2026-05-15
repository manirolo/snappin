import { ListMessagesSinceProps, ListMessagesSinceResponse } from "../../appRegistry.interface";
import { getOutlookClient } from "../outlook.client";
import { normalizeTimestamps } from "./normalizeTimestamps";

export async function listMessagesSince({ 
    accessToken, since, until, pageToken, limit = 500 
}: ListMessagesSinceProps): Promise<ListMessagesSinceResponse> {

    const client = getOutlookClient(accessToken);

    if (!since) return { messageIds: [], hasMore: false };

    const afterIso = await normalizeTimestamps({ unixSeconds: since });
    const filterParts = [`receivedDateTime ge ${afterIso}`];

    if (until) {
        const beforeIso = await normalizeTimestamps({ unixSeconds: until });
        filterParts.push(`receivedDateTime le ${beforeIso}`);
    }

    const request = pageToken
        ? client.api(pageToken)                              
        : client
            .api("/me/messages")
            .filter(filterParts.join(" and "))
            .orderby("receivedDateTime asc")
            .top(limit)
            .select("id");                                   

    const rawResponse = await request.get() as {
        value?: { id: string }[];
        "@odata.nextLink"?: string;
    };

    return {
        messageIds: rawResponse.value?.map((m) => m.id) ?? [],
        nextPageToken: rawResponse["@odata.nextLink"] ?? null,
        hasMore: !!rawResponse["@odata.nextLink"],
    };
}