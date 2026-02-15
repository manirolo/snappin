import { GenerateOAuthSessionProps, GenerateOAuthSessionResponse } from "../../appRegistry.interface";
import { google } from "../config"
import { gmailConfig } from "../config/gmail.config";

export async function generateSessionUrl({ state, codeVerifier, loginHint }: GenerateOAuthSessionProps): Promise<GenerateOAuthSessionResponse> {
    const url = google.createAuthorizationURL(state, codeVerifier, gmailConfig.permissions)
    url.searchParams.set("access_type", "offline");
    url.searchParams.set("prompt", "consent")
    if (loginHint) url.searchParams.set("login_hint", loginHint)
    return { session: { url: url.href } }
}
