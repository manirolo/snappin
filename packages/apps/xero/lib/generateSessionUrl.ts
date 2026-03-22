import { GenerateOAuthSessionProps, GenerateOAuthSessionResponse } from "../../appRegistry.interface";
import { xero } from "../xero.client"

export async function generateSessionUrl({ state, loginHint }: GenerateOAuthSessionProps): Promise<GenerateOAuthSessionResponse> {
    // xero-node handles PKCE and scope internally from the client config
    const url = await xero.buildConsentUrl();

    const urlObj = new URL(url);
    
    // Xero uses `state` for CSRF protection
    urlObj.searchParams.set("state", state);

    // Xero doesn't support login_hint natively, but some IdPs accept it
    if (loginHint) urlObj.searchParams.set("login_hint", loginHint);

    return { session: { url: urlObj.href } };
}
