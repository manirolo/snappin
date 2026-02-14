import { MailResource } from "@snappin/shared/inbox/mail.schema"
import { IntegrationResource } from "@snappin/shared/integration/integration.schema"

export type GenerateOAuthSessionProps = {

    state: string,

    codeVerifier: string

    /** For re-auth: pre-select this account in the OAuth consent (e.g. Google login_hint) */
    loginHint?: string
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

export type GetCursorProps = {

    accessToken: string
}

export type GetCursorResponse = {

    historyId?: string | null,

    deltaToken?: string | null
}

export type StartWatchingProps = {

    accessToken: string
}

export type StopWatchingProps = {

    accessToken: string
}

export type RenewWatchingProps = {

    accessToken: string
}

export type RenewWatchingResponse = {

    subscriptionId?: string | null

    historyId?: string | null,

    expiresAt?: string | null
}

export type StartWatchingResponse = {

    subscriptionId?: string | null

    historyId?: string | null

    expiresAt?: string | null
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

export type GetEmailByMessageIdResponse = MailResource

export type ListMessagesSinceProps = {
    accessToken: string
    since?: number
}

export type ListMessagesSinceResponse = {
    messageIds: string[]
    nextCursor?: string | null
}

export type NormalizeTimestamps = {
    unixSeconds: number
}

export type NormalizeTimestampsResponse = string

export type Options = {

    log?: true
}

export interface BaseOAuth {

    generateSessionUrl({ state, codeVerifier }: GenerateOAuthSessionProps): Promise<GenerateOAuthSessionResponse>

    getAccessToken({ integration }: RetrieveAccessToken): Promise<RetrieveAccessAccessTokenResponse>

    exchangeCodeForTokens({ code, codeVerifier }: ExchangeCodeForTokensProps): Promise<ExchangeCodeForTokensResponse>

    revokeToken({ token }: RevokeTokenProps): void
}

export interface EmailApps extends BaseOAuth {

    getUserEmailAddress({ }: GetUserEmailAddressProps): Promise<GetUserEmailAddressResponse>

    listMessagesSince(props: ListMessagesSinceProps, opt?: Options): Promise<ListMessagesSinceResponse>

    getCursor({ accessToken }: GetCursorProps): Promise<GetCursorResponse>

    startWatching({ }: StartWatchingProps): Promise<StartWatchingResponse>

    stopWatching({ accessToken }: StopWatchingProps): Promise<StopWatchingResponse>

    renewWatching({ }: RenewWatchingProps): Promise<RenewWatchingResponse>

    // getMessageIdsByHistoryId({ emailAddress, lastHistoryId, accessToken }: GetMessageIdsByHistoryId, opt?: Options): Promise<GetMessageIdsByHistoryIdResponse>

    getEmailByMessageId({ accessToken, messageId }: GetEmailByMessageId, opt?: Options): Promise<GetEmailByMessageIdResponse>

    normalizeTimestamps({ unixSeconds }: NormalizeTimestamps): Promise<NormalizeTimestampsResponse>
}