import { GenerateOAuthSessionProps, GenerateOAuthSessionResponse } from "../../appRegistry.interface";
import { google } from "../config"
import { gmailConfig } from "../config/config";

export async function generateSessionUrl({ state, codeVerifier }: GenerateOAuthSessionProps): Promise<GenerateOAuthSessionResponse> {
    const url = google.createAuthorizationURL(state, codeVerifier, gmailConfig.permissions)
    url.searchParams.set("access_type", "offline");
    url.searchParams.set("prompt", "consent")
    return { session: { url: url.href } }
}
