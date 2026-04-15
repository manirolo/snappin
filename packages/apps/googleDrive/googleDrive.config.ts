import { env } from "@snappin/env";
import { GoogleDriveConfigData } from "./googleDrive.types";

export const googleDriveConfigData: GoogleDriveConfigData = {
    clientId: env.google.clientId,
    clientSecret: env.google.clientSecret,
    callbackUrl: `${env.app.frontend_url}/api/v1/integration/callback`,
    permissions: ["https://www.googleapis.com/auth/drive.file"],
}