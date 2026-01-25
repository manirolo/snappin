import { GetRawMailBody } from "./provider.interface"

export const GoogleOAuthProvider = {
    /**
     * Fetch new Gmail messageIds since historyId
     * ⚠️ Does NOT return raw emails (avoids OOM)
     */
    async getMessageIdsByHistory(payload: GetRawMailBody): Promise<string[]> {
        if (!payload.accessToken) return []
        // const gmail = getGmailClient(payload.accessToken);

        // const messageIds = new Set<string>()
        // let pageToken: string | undefined;
        // do {
        //     // Fetch history page
        //     const historyRes = await gmail.users.history.list({
        //         userId: "me",
        //         startHistoryId: String(payload.historyId),
        //         historyTypes: ["messageAdded"],
        //         pageToken,
        //     });

        //     const historyArray = historyRes.data.history ?? [];


        //     for (const history of historyArray) {
        //         for (const entry of history.messagesAdded ?? []) {
        //             const messageId = entry.message?.id
        //             if (!messageId) continue
        //             messageIds.add(messageId)
        //         }
        //     }

        //     pageToken = historyRes.data.nextPageToken ?? undefined;
        // } while (pageToken);

        // return messageIds
        return []
    },
}
