import { GenerateOAuthSessionProps, GenerateOAuthSessionResponse } from "../../appRegistry.interface";
import { google } from "../googleDrive.client"
import { googleDriveConfigData } from "../googleDrive.config";

export async function generateSessionUrl({ state, codeVerifier, loginHint }: GenerateOAuthSessionProps): Promise<GenerateOAuthSessionResponse> {
    const url = google.createAuthorizationURL(state, codeVerifier, googleDriveConfigData.permissions)
    url.searchParams.set("access_type", "offline");
    url.searchParams.set("prompt", "consent")
    if (loginHint) url.searchParams.set("login_hint", loginHint)
    return { session: { url: url.href } }
}
