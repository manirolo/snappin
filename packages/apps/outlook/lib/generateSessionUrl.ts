import { GenerateOAuthSessionProps, GenerateOAuthSessionResponse } from "../../appRegistry.interface";
import { outlook } from "../outlook.client"
import { outlookConfig } from "../outlook.config";

export async function generateSessionUrl({ state, codeVerifier, loginHint }: GenerateOAuthSessionProps): Promise<GenerateOAuthSessionResponse> {
    const url = outlook.createAuthorizationURL(state, codeVerifier, outlookConfig.permissions)
    url.searchParams.set("access_type", "offline");
    url.searchParams.set("prompt", "consent")
    if (loginHint) url.searchParams.set("login_hint", loginHint)
    return { session: { url: url.href } }
}
