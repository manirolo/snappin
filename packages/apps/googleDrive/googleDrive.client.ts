import { googleDriveConfigData } from "./googleDrive.config"
import { google as g } from "googleapis"
import * as arctic from "arctic"

export const google = new arctic.Google(googleDriveConfigData.clientId, googleDriveConfigData.clientSecret, googleDriveConfigData.callbackUrl)

export function getGoogleDriveClient(accessToken: string) {
    const auth = new g.auth.OAuth2();
    auth.setCredentials({
        access_token: accessToken,
    });

    return g.drive({ version: "v3", auth });
}