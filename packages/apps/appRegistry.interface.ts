import { AppSlug, EmailAppSlug, StorageAppSlug } from "@snappin/shared/apps/app.schema"
import { MailResource } from "@snappin/shared/inbox/mail.schema"
import { EmailProviderMap, IntegrationResource, StorageProviderMap } from "@snappin/shared/integration/integration.schema"
import { StorageOrganizationStrategy } from "@snappin/shared/integration/storage.schema"
import { InvoiceFileFormatPreference } from "@snappin/shared/organization/preference/invoiceFileFormatPreference.schema"

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
    integration: Partial<IntegrationResource>
}

export type RetrieveAccessTokenResponse = {
    accessToken: string
}

export type ExchangeCodeForTokensProps = {
    code: string,
    state?: string | null,
    codeVerifier?: string | null,
    callbackUrl?: string | null
}

export type ExchangeCodeForTokensResponse = {
    accessToken: string
    refreshToken: string
    accessTokenExpiresAt: string
}

export type GetCursorProps = {
    accessToken: string
}

export type GetCursorResponse = {
    historyId?: string | null,
    deltaToken?: string | null
}

export type StartWatchingProps = {
    integration: Partial<IntegrationResource>
}

export type StopWatchingProps = {
    integration: Partial<IntegrationResource>
}

export type RenewWatchingProps = {
    accessToken: string
    subscriptionId?: string
}

export type RenewWatchingResponse = {
    subscriptionId?: string | null
    historyId?: number | null,
    watchExpiresAt?: number | null
    subscriptionExpiresAt?: string | null
}

export type StartWatchingResponse = {
    subscriptionId?: string | null
    historyId?: number | null
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
    accessToken?: string | null;
    tenantId?: string | null;
}

export type ResolveMessageIdsProps<TSlug extends EmailAppSlug> = {
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
    until?: number
    pageToken?: string | null
    limit?: number
}

export type ListMessagesSinceResponse = {
    messageIds: string[]
    nextPageToken?: string | null
    hasMore?: boolean
    totalEstimate?: number | null
}

export type NormalizeTimestamps = {
    unixSeconds: number
}

export type BuildEmailIntegrationData = {
    accessToken?: string | null;
    accessTokenExpiresAt?: string | null;
    refreshToken?: string | null;
}

export type BuildEmailIntegrationDataResponse<TSlug extends EmailAppSlug> = {
    accessToken?: string | null;
    accessTokenExpiresAt?: string | null;
    refreshToken?: string | null;
    refreshTokenExpiresAt?: string | null;
    identifierEmail?: string | null;
    metadata: EmailProviderMap[TSlug]["metadata"]
}

export type BuildStorageIntegrationData = {
    accessToken?: string | null
    accessTokenExpiresAt?: string | null
    refreshToken?: string | null
}

export type BuildStorageIntegrationDataResponse<TSlug extends StorageAppSlug> = {
    accessToken?: string | null
    accessTokenExpiresAt?: string | null
    refreshToken?: string | null
    identifierEmail?: string | null
    metadata: StorageProviderMap[TSlug]["metadata"]
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

export type NormalizeNotificationProps<TSlug extends EmailAppSlug> = {
    body: EmailProviderMap[TSlug]["webhookPayload"];
};

export type NormalizeNotificationResponse = NormalizedEmailNotification[];

export type NormalizeTimestampsResponse = string

export type Options = {
    log?: true
}

export type AddOAuthClientIntegrationResponse = { redirectAfter: string }

export type FindOrCreateFolderProps = {
    accessToken: string
    folderName: string
}

export type FindOrCreateFolderResponse = {
    folderId: string
}

export type CreateFileProps = {
    accessToken: string
    rootFolderId: string
    integrationId: string
    fileName: string
    mimeType: string
    content: Buffer
    strategy: StorageOrganizationStrategy
    year: string
    vendor?: string
    format?: InvoiceFileFormatPreference
    date?: string | null
    invoiceId?: string | null
    amount?: number | null
    currency?: string | null
}

export type IsWatchExpires = {
    integration: IntegrationResource
}

export type IsWatchExpiresResponse = boolean

export type CreateFileResponse = {
    fileId: string,
    fileUrl?: string | null,
}

export interface ResolveIntegrationIdentity {
    code: string
    codeVerifier?: string | null,
    callbackUrl?: string | null,
    state?: string | null
}

export interface ResolveIntegrationIdentityResponse {
    accessToken: string
    refreshToken: string
    accessTokenExpiresAt: string
    identifierEmail: string
}

export type BuildAccountingIntegrationData = {
    accessToken?: string | null;
    accessTokenExpiresAt?: string | null;
    refreshToken?: string | null;
}

export type BuildAccountingIntegrationDataResponse = {
    accessToken?: string | null;
    accessTokenExpiresAt?: string | null;
    refreshToken?: string | null;
    identifierEmail?: string | null;
    metadata?: {
        tenantId?: string | null;
        orgName?: string | null;
    }
}

export type AccountOption = {
    label: string;  // account name
    value: string;  // account id
    code?: string | null;   // account code (e.g. "200")
    type?: string | null;   // e.g. "EXPENSE", "REVENUE"
}

export type GetAccountsResponse = {
    accounts: AccountOption[];
}

export type BillLineItem = {
    description: string;
    quantity: number;
    unitAmount: number;
    accountCode?: string | null;  // links to account
    taxType?: string | null;
    lineAmount?: number | null;
}

export enum LineAmountType {
    EXCLUSIVE = "EXCLUSIVE",
    INCLUSIVE = "INCLUSIVE",
    NONE = "NONE",
}

export type CreateBillProps = {
    accessToken: string;
    tenantId: string;
    contactName: string;
    contactEmail?: string | null;
    invoiceNumber?: string | null;
    reference?: string | null;
    invoiceDate?: string | null;
    dueDate?: string | null;
    currency?: string | null;
    lineAmountType?: LineAmountType | null;
    lineItems: BillLineItem[];
    attachment?: {
        buffer: Buffer;
        fileName: string;
        mimeType: string;
    } | null;
}

export type CreateBillResponse = {
    billId: string;
    invoiceNumber: string | null;
    status: string;
    url?: string | null;
}

export interface BaseOAuth {
    generateSessionUrl({ state, codeVerifier }: GenerateOAuthSessionProps): Promise<GenerateOAuthSessionResponse>
    getAccessToken({ integration }: RetrieveAccessToken): Promise<RetrieveAccessTokenResponse>
    exchangeCodeForTokens({ code, codeVerifier }: ExchangeCodeForTokensProps): Promise<ExchangeCodeForTokensResponse>
    revokeToken({ token }: RevokeTokenProps): void
}

export interface EmailApps<TSlug extends EmailAppSlug> extends BaseOAuth {
    getUserEmailAddress({ accessToken }: GetUserEmailAddressProps): Promise<GetUserEmailAddressResponse>
    listMessagesSince(props: ListMessagesSinceProps): Promise<ListMessagesSinceResponse>
    getCursor({ accessToken }: GetCursorProps): Promise<GetCursorResponse>
    startWatching({ integration }: StartWatchingProps): Promise<StartWatchingResponse>
    stopWatching({ integration }: StopWatchingProps): Promise<StopWatchingResponse>
    renewWatching({ accessToken }: RenewWatchingProps): Promise<RenewWatchingResponse>
    resolveMessageIds<TSlug extends EmailAppSlug>(props: ResolveMessageIdsProps<TSlug>): Promise<ResolveMessageIdsResponse>
    getEmail({ accessToken, messageId }: GetEmail): Promise<GetEmailResponse>
    normalizeTimestamps({ unixSeconds }: NormalizeTimestamps): Promise<NormalizeTimestampsResponse>
    resolveIdentity(props: ResolveIntegrationIdentity): Promise<ResolveIntegrationIdentityResponse>
    buildIntegrationData(props: BuildEmailIntegrationData): Promise<BuildEmailIntegrationDataResponse<TSlug>>
    normalizeNotification(props: NormalizeNotificationProps<TSlug>): Promise<NormalizeNotificationResponse>;
    getIntegrationData(props: GetIntegrationProps): Promise<EmailProviderMap[TSlug]["integration"] | null>;
    isWatchExpires(props: IsWatchExpires): Promise<IsWatchExpiresResponse>;
}

export interface StorageApps<TSlug extends StorageAppSlug> extends BaseOAuth {
    resolveIdentity(props: ResolveIntegrationIdentity): Promise<ResolveIntegrationIdentityResponse>
    buildIntegrationData(props: BuildEmailIntegrationData): Promise<BuildStorageIntegrationDataResponse<TSlug>>
    getUserEmailAddress({ accessToken }: GetUserEmailAddressProps): Promise<GetUserEmailAddressResponse>
    findOrCreateFolder(props: FindOrCreateFolderProps): Promise<FindOrCreateFolderResponse>
    createFile(props: CreateFileProps): Promise<CreateFileResponse>
}

export interface AccountingApps extends BaseOAuth {
    resolveIdentity(props: ResolveIntegrationIdentity): Promise<ResolveIntegrationIdentityResponse>
    buildIntegrationData(props: BuildAccountingIntegrationData): Promise<BuildAccountingIntegrationDataResponse>
    getUserEmailAddress({ accessToken }: GetUserEmailAddressProps): Promise<GetUserEmailAddressResponse>
    getAccounts(props: { accessToken: string; tenantId: string }): Promise<GetAccountsResponse>  // ✅
    createBill(props: CreateBillProps): Promise<CreateBillResponse>
}