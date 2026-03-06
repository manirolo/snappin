import { AppSlug } from "@snappin/shared/apps/app.schema";
import { ResolveMessageIdsProps, ResolveMessageIdsResponse } from "../../appRegistry.interface";

export async function resolveMessageIds({ messageId }: ResolveMessageIdsProps<AppSlug.OUTLOOK>): Promise<ResolveMessageIdsResponse> {

    if (!messageId) return { messageIds: [] };

    return {
        messageIds: [messageId],
        nextHistoryId: null,
    };
}
