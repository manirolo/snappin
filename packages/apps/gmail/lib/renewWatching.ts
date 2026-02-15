import { RenewWatchingProps, RenewWatchingResponse } from "../../appRegistry.interface";
import { getGmailClient } from "../config";
import { gmailConfig } from "../config/gmail.config";

export async function renewWatching({ accessToken }: RenewWatchingProps): Promise<RenewWatchingResponse> {
    const gmail = getGmailClient(accessToken);

    const res = await gmail.users.watch({
        userId: "me",
        requestBody: {
            topicName: gmailConfig.topic,
            labelIds: ["INBOX"],
            labelFilterAction: "include",
        },
    });

    return {
        historyId: res.data.historyId!,
        expiresAt: res.data.expiration,
    };
}