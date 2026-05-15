import { ResolveIntegrationIdentity } from "../../appRegistry.interface";
import { OutlookAppServices } from "../outlook.app";
import { SnappinError } from "@snappin/lib/error/snappin.error";

export async function resolveIdentity({ code, codeVerifier }: ResolveIntegrationIdentity) {
    if (!code || !codeVerifier) {
        throw new SnappinError("We received partial or no integration data from Outlook", "invalid_integration_request")
    }
    const { accessToken, refreshToken, accessTokenExpiresAt } = await OutlookAppServices.exchangeCodeForTokens({ code, codeVerifier })
    const { emailAddress } = await OutlookAppServices.getUserEmailAddress({ accessToken })
    return { accessToken, refreshToken, accessTokenExpiresAt, identifierEmail: emailAddress }
}
