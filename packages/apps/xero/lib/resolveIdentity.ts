import { ResolveIntegrationIdentity } from "../../appRegistry.interface";
import { XeroAppServices } from "../xero.app";
import { SnappinError } from "@snappin/lib/error/snappin.error";

export async function resolveIdentity({ code, callbackUrl, state }: ResolveIntegrationIdentity) {
    if (!code) {
        throw new SnappinError("We received partial or no integration data from Xero", "invalid_integration_request");
    }

    const { accessToken, refreshToken, accessTokenExpiresAt } = await XeroAppServices.exchangeCodeForTokens({
        code,
        callbackUrl,
        state,
    });

    const { emailAddress } = await XeroAppServices.getUserEmailAddress({ accessToken });

    return { accessToken, refreshToken, accessTokenExpiresAt, identifierEmail: emailAddress };
}