import { ListMessagesSinceProps, ListMessagesSinceResponse } from "../../appRegistry.interface";
import { getOutlookClient } from "../outlook.client";
import { normalizeTimestamps } from "./normalizeTimestamps";

type GraphMessage = {
    id: string;
    receivedDateTime: string;
};

type GraphListResponse = {
    value?: GraphMessage[];
};

export async function listMessagesSince({ accessToken, since, }: ListMessagesSinceProps): Promise<ListMessagesSinceResponse> {

    const client = getOutlookClient(accessToken);

    if (!since) {
        return { messageIds: [] };
    }

    const iso = await normalizeTimestamps({ unixSeconds: since });

    const rawResponse = await client
        .api("/me/messages")
        .filter(`receivedDateTime ge ${iso}`)
        .orderby("receivedDateTime asc")
        .top(50)
        .get();

    const res = rawResponse as GraphListResponse;

    return {
        messageIds: res.value?.map((message) => message.id) ?? [],
    };
}

