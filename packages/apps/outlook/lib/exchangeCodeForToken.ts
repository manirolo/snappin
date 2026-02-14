import { ExchangeCodeForTokensProps, ExchangeCodeForTokensResponse } from "../../appRegistry.interface";
import { outlook } from "../outlook.client";

export async function exchangeCodeForTokens(payload: ExchangeCodeForTokensProps): Promise<ExchangeCodeForTokensResponse> {

    const tokens = await outlook.validateAuthorizationCode(payload.code, payload.codeVerifier)
    const accessToken = tokens.accessToken()
    const refreshToken = tokens.refreshToken()
    const accessTokenExpiresAt = tokens.accessTokenExpiresAt()

    return { accessToken, refreshToken, accessTokenExpiresAt }
}