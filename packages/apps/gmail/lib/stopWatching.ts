import { StopWatchingProps } from "../../appRegistry.interface";
import { getGmailClient } from "../config";

export async function stopWatching({ accessToken }: StopWatchingProps): Promise<void> {
    const gmail = getGmailClient(accessToken);
    await gmail.users.stop({
        userId: "me",
    });
}