import { StopWatchingProps } from "../../appRegistry.interface";
import { getGmailClient } from "../gmail.client";
import { getAccessToken } from "./getAccessToken";

export async function stopWatching({ integration }: StopWatchingProps): Promise<void> {
   const { accessToken } = await getAccessToken({ integration })
    const gmail = getGmailClient(accessToken);
    await gmail.users.stop({
        userId: "me",
    });
}