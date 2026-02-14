import { gmailConfig } from "./gmail.config"
import { google as g } from "googleapis"
import * as arctic from "arctic"

export const google = new arctic.Google(gmailConfig.clientId, gmailConfig.clientSecret, gmailConfig.callbackUrl)

export function getGmailClient(accessToken: string) {
    const auth = new g.auth.OAuth2();
    auth.setCredentials({
        access_token: accessToken,
    });

    return g.gmail({ version: "v1", auth });
}