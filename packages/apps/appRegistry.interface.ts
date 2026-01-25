import { IntegrationResource } from "@snappin/db/model/integration.model"
import { gmail_v1 } from "googleapis"

export type GenerateOAuthSessionProps = {
    state: string,
    codeVerifier: string
}
export type GenerateOAuthSessionResponse = {
    session: { url: string }
} | null | undefined
export type RetrieveAccessToken = {
    integration: IntegrationResource
}
export type RetrieveAccessAccessTokenResponse = {
    accessToken: string
}
export type ExchangeCodeForTokensProps = {
    code: string,
    codeVerifier: string
}
export type ExchangeCodeForTokensResponse = {
    accessToken: string
    refreshToken: string
    accessTokenExpiresAt: Date
}
export type StartWatchingProps = {
    accessToken: string
}
export type StartWatchingResponse = {
    historyId?: string | null,
    expiresAt?: string | null
}
export type StopWatchingProps = {
    accessToken: string
}
export type StopWatchingResponse = void
/**
 * IMPORTANT: You need pass valid access token and doesn't expired
 */
export type GetUserEmailAddressProps = {
    accessToken: string
}
export type GetUserEmailAddressResponse = {
    emailAddress: string
}
export type RevokeTokenProps = {
    token: string
}
export type GetMessageIdsByHistoryId = {
    emailAddress: string
    lastHistoryId: string
    accessToken?: string
}
export type GetMessageIdsByHistoryIdResponse = string[]
export type GetEmailByMessageId = {
    accessToken: string,
    messageId: string
}
export type GetEmailByMessageIdResponse = {
    subject?: string | null
    from?: string | null
    snippet?: string | null
    bodyText?: string
    attachments: {
        fileName: string
        mimeType: string
        attachmentId: string
        buffer?: Buffer
    }[]
}

export interface BaseOAuth {
    generateSessionUrl({ state, codeVerifier }: GenerateOAuthSessionProps): Promise<GenerateOAuthSessionResponse>
    getAccessToken({ integration }: RetrieveAccessToken): Promise<RetrieveAccessAccessTokenResponse>
    exchangeCodeForTokens({ code, codeVerifier }: ExchangeCodeForTokensProps): Promise<ExchangeCodeForTokensResponse>
    revokeToken({ token }: RevokeTokenProps): void
}

export interface EmailApps extends BaseOAuth {
    getUserEmailAddress({ }: GetUserEmailAddressProps): Promise<GetUserEmailAddressResponse>
    startWatching({ accessToken }: StartWatchingProps): Promise<StartWatchingResponse>
    stopWatching({ accessToken }: StopWatchingProps): Promise<StopWatchingResponse>
    getMessageIdsByHistoryId({ emailAddress, lastHistoryId, accessToken }: GetMessageIdsByHistoryId): Promise<GetMessageIdsByHistoryIdResponse>
    getEmailByMessageId({ accessToken, messageId }: GetEmailByMessageId): Promise<GetEmailByMessageIdResponse>
}