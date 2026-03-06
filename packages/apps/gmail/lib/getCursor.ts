import { GetCursorProps, GetCursorResponse } from "../../appRegistry.interface";
import { getGmailClient } from "../gmail.client"

export async function getCursor({ accessToken }: GetCursorProps): Promise<GetCursorResponse> {
    const gmail = getGmailClient(accessToken);
    const profile = await gmail.users.getProfile({ userId: "me" });

    return { historyId: profile.data.historyId }
}