import { StartWatchingProps, StartWatchingResponse } from "../../appRegistry.interface";
import { getGmailClient } from "../config";
import { gmailConfig } from "../config/gmail.config";

export async function startWatching({ accessToken }: StartWatchingProps): Promise<StartWatchingResponse> {
    const gmail = getGmailClient(accessToken);
    const watch = await gmail.users.watch({
        userId: "me",
        requestBody: {
            topicName: gmailConfig.topic,
            labelIds: ["INBOX"],
            labelFilterAction: "include"
        }
    });

    return {
        historyId: watch.data.historyId,
        expiresAt: watch.data.expiration
    }
}