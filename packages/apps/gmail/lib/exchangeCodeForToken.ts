import { SnappinError } from "@snappin/lib/error/snappin.error";
import { ExchangeCodeForTokensProps, ExchangeCodeForTokensResponse } from "../../appRegistry.interface";
import { google } from "../gmail.client";

export async function exchangeCodeForTokens(payload: ExchangeCodeForTokensProps): Promise<ExchangeCodeForTokensResponse> {

    if (!payload.code || !payload.codeVerifier) {
        throw new SnappinError("Authentication failed", "invalid_integration_request")
    }
    
    const tokens = await google.validateAuthorizationCode(payload.code, payload.codeVerifier)
    const accessToken = tokens.accessToken()
    const refreshToken = tokens.refreshToken()
    const accessTokenExpiresAt = tokens.accessTokenExpiresAt()

    return { accessToken, refreshToken, accessTokenExpiresAt }
}