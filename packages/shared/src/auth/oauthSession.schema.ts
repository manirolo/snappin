import { AppCategory, AppSlug, AppType } from "../apps/app.enum"

export type OAuthSessionResource = {
    // User who requested OAuth Session
    // It can't be null
    userId: string,

    // User can request OAuth Session from any one of the organization they belongs to
    // Output of this session can be accessed only they logged in to this organization 
    // OrganizationId can be null or undefined
    orgId?: string | null,

    // Auto generated safe key by arctic package for CSRF Protection
    // Helps correlating a requesting to callback
    state?: string | null,

    // A secret key generated for secure code exchange
    codeVerifier?: string | null,

    // Various providers slug or name represents them
    // They are integration tool to extract invoices and export to accounting tools
    // It can't be null
    appSlug?: AppSlug | null,

    // Types of providers i.e Email, Storage, etc
    appCategory?: AppCategory | null,

    appType?: AppType | null,

    // We are gone have wide range of scopes/permissions 
    // (i.e) https://www.googleapis.com/auth/gmail.readonly - It is a scope for reading mails from gmail
    // (refer) -> https://oauth.net/2/scope/
    scope?: string[] | null,

    // Redirect user after session callback
    redirectAfter?: string | null,

    // It is set for session validity
    // Mongodb auto deletes the document based on the time specified
    // Usually session validity is 5 mins
    expiresAt?: Date | null,

    reAuthenticateSession?: boolean | null,

    reAuthenticate?: {

        integrationId?: string | null
    }

    // Timestamps
    createdAt?: number,
    updatedAt?: number
}