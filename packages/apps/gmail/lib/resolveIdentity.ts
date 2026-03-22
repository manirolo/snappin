import { ResolveIntegrationIdentity } from "../../appRegistry.interface";
import { GmailAppServices } from "../gmail.app";
import { SnappinError } from "@snappin/lib/error/snappin.error";

export async function resolveIdentity({ code, codeVerifier }: ResolveIntegrationIdentity) {
    if (!code || !codeVerifier) {
        throw new SnappinError("We received partial or no integration data from Gmail", "invalid_integration_request")
    }
    const { accessToken, refreshToken, accessTokenExpiresAt } = await GmailAppServices.exchangeCodeForTokens({ code, codeVerifier })
    const { emailAddress } = await GmailAppServices.getUserEmailAddress({ accessToken })
    return { accessToken, refreshToken, accessTokenExpiresAt, identifierEmail: emailAddress }
}