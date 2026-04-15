import { RenewWatchingProps, RenewWatchingResponse } from "../../appRegistry.interface";
import { getGmailClient } from "../gmail.client";
import { gmailConfigData } from "../gmail.config";

export async function renewWatching({ accessToken }: RenewWatchingProps): Promise<RenewWatchingResponse> {
    const gmail = getGmailClient(accessToken);

    const res = await gmail.users.watch({
        userId: "me",
        requestBody: {
            topicName: gmailConfigData.topic,
            labelIds: ["INBOX"],
            labelFilterAction: "include",
        },
    });

    return {
        historyId: Number(res.data.historyId)!,
        watchExpiresAt: Number(res.data.expiration),
    };
}