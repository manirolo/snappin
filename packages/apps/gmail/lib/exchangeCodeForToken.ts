import { ExchangeCodeForTokensProps, ExchangeCodeForTokensResponse } from "../../appRegistry.interface";
import { google } from "../config";

export async function exchangeCodeForTokens(payload: ExchangeCodeForTokensProps): Promise<ExchangeCodeForTokensResponse> {

    const tokens = await google.validateAuthorizationCode(payload.code, payload.codeVerifier)
    const accessToken = tokens.accessToken()
    const refreshToken = tokens.refreshToken()
    const accessTokenExpiresAt = tokens.accessTokenExpiresAt()

    return { accessToken, refreshToken, accessTokenExpiresAt }
}