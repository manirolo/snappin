import { ListMessagesSinceProps, ListMessagesSinceResponse } from "../../appRegistry.interface";
import { getGmailClient } from "../config";
import { normalizeTimestamps } from "./normalizeTimestamps";


export async function listMessagesSince({ accessToken, since, }: ListMessagesSinceProps): Promise<ListMessagesSinceResponse> {

    const gmail = getGmailClient(accessToken);

    if (!since) return { messageIds: [] };

    const unix = await normalizeTimestamps({ unixSeconds: since });

    const res = await gmail.users.messages.list({
        userId: "me",
        q: `after:${unix}`,
    });

    return {
        messageIds: res.data.messages?.map((m) => m.id!) || [],
    };
}
