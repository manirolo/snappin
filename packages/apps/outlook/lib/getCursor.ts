import { GetCursorProps, GetCursorResponse } from "../../appRegistry.interface";
import { getOutlookClient } from "../outlook.client";

export async function getCursor({ accessToken }: GetCursorProps): Promise<GetCursorResponse> {
    const outlook = getOutlookClient(accessToken);
    const res = await outlook
        .api("/me/mailFolders('Inbox')/messages/delta")
        .get();


    return { deltaToken: res["@odata.deltaLink"] }
}