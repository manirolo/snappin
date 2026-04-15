import { logger } from "@snappin/lib/logger";
import { ResolveMessageIdsProps, ResolveMessageIdsResponse } from "../../appRegistry.interface";
import { getGmailClient } from "../gmail.client";
import { AppSlug } from "@snappin/shared/apps/app.schema";
import { SnappinError } from "@snappin/lib/error/snappin.error";
import { getAccessToken } from "./getAccessToken";

export async function resolveMessageIds({ integration, historyId }: ResolveMessageIdsProps<AppSlug.GMAIL>): Promise<ResolveMessageIdsResponse> {

    if (!integration || !integration.accessToken) {

        console.log("⚠️ Problem here: Access token not given. So you will get an empty array.")

        throw new SnappinError("No integration found", "no_integration_found")
    }

    if (!historyId) {
        console.warn("No historyId provided, skipping history fetch")
        return { messageIds: [], nextHistoryId: null }
    }

    const { accessToken } = await getAccessToken({ integration })

    const gmail = getGmailClient(accessToken)

    const messageIds = new Set<string>();

    // Google sends data in paginated formate sometimes so we have to loop through the pages 
    let pageToken: string | undefined;

    do {

        try {

            const historyResponse = await gmail.users.history.list({
                userId: "me",
                startHistoryId: String(integration.metadata.historyId),
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
        }
        catch (err) {
            logger.error(err)
        }

    } while (pageToken)

    return { messageIds: Array.from(messageIds), nextHistoryId: historyId }
} 