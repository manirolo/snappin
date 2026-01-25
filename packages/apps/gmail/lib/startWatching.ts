import { StartWatchingProps, StartWatchingResponse } from "../../appRegistry.interface";
import { getGmailClient } from "../config";
import { gmailConfig } from "../config/config";

export async function startWatching({ accessToken }: StartWatchingProps): Promise<StartWatchingResponse> {
    const gmail = getGmailClient(accessToken);
    const res = await gmail.users.watch({
        userId: "me",
        requestBody: {
            topicName: gmailConfig.topic,
            labelIds: ["INBOX"],
            labelFilterAction: "include"
        }
    })

    return { historyId: res.data.historyId, expiresAt: res.data.expiration }
}