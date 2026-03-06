import { StartWatchingProps, StartWatchingResponse } from "../../appRegistry.interface";
import { getGmailClient } from "../gmail.client";
import { gmailConfigData } from "../gmail.config";
import { getAccessToken } from "./getAccessToken";

export async function startWatching({ integration }: StartWatchingProps): Promise<StartWatchingResponse> {
    const { accessToken } = await getAccessToken({ integration })
    const gmail = getGmailClient(accessToken);
    const watch = await gmail.users.watch({
        userId: "me",
        requestBody: {
            topicName: gmailConfigData.topic,
            labelIds: ["INBOX"],
            labelFilterAction: "include"
        }
    });

    return {
        historyId: Number(watch.data.historyId),
        expiresAt: watch.data.expiration
    }
}