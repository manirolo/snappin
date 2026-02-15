import { AppSlug } from "@snappin/shared/apps/app.enum"
import { MailResource } from "@snappin/shared/inbox/mail.schema"
import { EmailProviderMap, IntegrationResource } from "@snappin/shared/integration/integration.schema"

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

export type RetrieveAccessTokenResponse = {

    accessToken: string
}

export type ExchangeCodeForTokensProps = {

    code: string,

    codeVerifier?: string | null
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

export type ResolveMessageIdsProps<TSlug extends AppSlug> = {
    integration: EmailProviderMap[TSlug]["integration"];
} & EmailProviderMap[TSlug]["resolveMessageInput"];

export type ResolveMessageIdsResponse = {
    messageIds: string[];
    nextHistoryId?: number | null;
};

export type GetEmail = {

    accessToken: string,

    messageId: string
}

export type GetEmailResponse = MailResource

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

export type BuildEmailIntegrationData = {

    code?: string | null;

    codeVerifier?: string | null;
}

export type BuildEmailIntegrationDataResponse<TSlug extends AppSlug> = {
    accessToken?: string | null;
    accessTokenExpiresAt?: Date | null;
    refreshToken?: string | null;
    refreshTokenExpiresAt?: Date | null;
    identifierEmail?: string | null;
    config: EmailProviderMap[TSlug]["config"]
}

export type NormalizedEmailNotification = {
    provider: AppSlug;
    integrationKey: string; // subscriptionId or emailAddress
    cursor?: number | null; // historyId (gmail) or deltaToken (outlook)
    messageId?: string | null; // outlook immediate message id
};

export type GetIntegrationProps = {
    integrationKey: string;
};

export type NormalizeNotificationProps<TSlug extends AppSlug> = {
    body: EmailProviderMap[TSlug]["webhookPayload"];
};

export type NormalizeNotificationResponse = NormalizedEmailNotification[];

export type NormalizeTimestampsResponse = string

export type Options = {

    log?: true
}

export interface BaseOAuth {

    generateSessionUrl({ state, codeVerifier }: GenerateOAuthSessionProps): Promise<GenerateOAuthSessionResponse>

    getAccessToken({ integration }: RetrieveAccessToken): Promise<RetrieveAccessTokenResponse>

    exchangeCodeForTokens({ code, codeVerifier }: ExchangeCodeForTokensProps): Promise<ExchangeCodeForTokensResponse>

    revokeToken({ token }: RevokeTokenProps): void
}

export interface EmailApps<TSlug extends AppSlug> extends BaseOAuth {

    getUserEmailAddress({ accessToken }: GetUserEmailAddressProps): Promise<GetUserEmailAddressResponse>

    listMessagesSince(props: ListMessagesSinceProps): Promise<ListMessagesSinceResponse>

    getCursor({ accessToken }: GetCursorProps): Promise<GetCursorResponse>

    startWatching({ accessToken }: StartWatchingProps): Promise<StartWatchingResponse>

    stopWatching({ accessToken }: StopWatchingProps): Promise<StopWatchingResponse>

    renewWatching({ accessToken }: RenewWatchingProps): Promise<RenewWatchingResponse>

    resolveMessageIds<TSlug extends AppSlug>(props: ResolveMessageIdsProps<TSlug>): Promise<ResolveMessageIdsResponse>

    getEmail({ accessToken, messageId }: GetEmail): Promise<GetEmailResponse>

    normalizeTimestamps({ unixSeconds }: NormalizeTimestamps): Promise<NormalizeTimestampsResponse>

    buildIntegrationData({ code, codeVerifier }: BuildEmailIntegrationData): Promise<BuildEmailIntegrationDataResponse<TSlug>>

    normalizeNotification(props: NormalizeNotificationProps<TSlug>): Promise<NormalizeNotificationResponse>;

    getIntegrationData(props: GetIntegrationProps): Promise<EmailProviderMap[TSlug]["integration"] | null>
}