import { Model, model, models, Schema } from "mongoose"
import { timestampPlugin } from "../plugin/timestamps.plugin"
import { AppCategory, AppSlug } from "@snappin/shared/apps/app.enum"

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
    appSlug: AppSlug,

    // Types of providers i.e Email, Storage, etc
    appCategory: AppCategory,

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

    // Timestamps
    createdAt?: Number,
    updatedAt?: Number
}
// Session valid for 5 minutes only
// Set expiresAt to allow mongodb enable TTL to delete
// Delete is handled by mongodb. Delete triggered every 60sec (Not sure about interval) 
const TTLMinutes = 5

const OAuthSessionSchema = new Schema<OAuthSessionResource>({
    userId: { type: String, trim: true, required: true },
    orgId: { type: String, trim: true, default: null },
    state: { type: String, unique: true, index: true, required: true },
    codeVerifier: { type: String, required: true },
    appSlug: { type: String, enum: AppSlug, required: true },
    appCategory: { type: String, enum: AppCategory, required: true },
    scope: { type: [String], required: true },
    redirectAfter: { type: [String], default: null },
    expiresAt: { type: Date, default: () => new Date(Date.now() + TTLMinutes * 60 * 1000), index: { expires: 0 } },
    createdAt: Number,
    updatedAt: Number
})

OAuthSessionSchema.plugin(timestampPlugin)

export const OAuthSession: Model<OAuthSessionResource> = (models.OAuthSession as Model<OAuthSessionResource>) ?? model<OAuthSessionResource>("OAuthSession", OAuthSessionSchema, "oauth_session")