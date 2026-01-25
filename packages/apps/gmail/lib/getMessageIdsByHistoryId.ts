import { GetMessageIdsByHistoryId, GetMessageIdsByHistoryIdResponse } from "../../appRegistry.interface";
import { getGmailClient } from "../config";

export async function getMessageIdsByHistoryId(payload: GetMessageIdsByHistoryId): Promise<GetMessageIdsByHistoryIdResponse> {
    if (!payload.accessToken){
        console.log("Problem here: Access token not given. So you will get an empty array.")    
        return []
    }

    const gmail = getGmailClient(payload.accessToken)

    const messageIds = new Set<string>();

    // Google sends data in paginated formate sometimes so we have to loop through the pages 
    let pageToken: string | undefined;

    do {

        const historyResponse = await gmail.users.history.list({
            userId: "me",
            startHistoryId: String(payload.lastHistoryId),
            historyTypes: ["messageAdded"],
            pageToken
        })

        const historyArray = historyResponse.data.history ?? [];

        for (const history of historyArray) {
            for (const entry of history.messagesAdded ?? []) {
                const messageId = entry.message?.id
                if (!messageId) continue
                messageIds.add(messageId)
            }
        }

        pageToken = historyResponse.data.nextPageToken ?? undefined;

    } while (pageToken)

    return Array.from(messageIds)
} 