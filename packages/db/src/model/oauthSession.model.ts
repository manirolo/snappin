import mongoose from "mongoose"
import { timestampPlugin } from "../plugin/timestamps.plugin"
import { AppCategory, AppRole, AppSlug, AppType } from "@snappin/shared/apps/app.schema"
import { OAuthSessionResource } from "@snappin/shared/auth/oauthSession.schema"

// Session valid for 5 minutes only
// Set expiresAt to allow mongodb enable TTL to delete
// Delete is handled by mongodb. Delete triggered every 60sec (Not sure about interval) 
const TTLMinutes = 5

const ReAuthenticate = new mongoose.Schema({
    integrationId: { type: String, default: null }
})

const OAuthSessionSchema = new mongoose.Schema<OAuthSessionResource>({
    userId: { type: String, trim: true, required: true },
    orgId: { type: String, trim: true, default: null },
    state: { type: String, unique: true, index: true, required: true },
    codeVerifier: { type: String, required: true },
    appSlug: { type: String, enum: AppSlug, required: true },
    appCategory: { type: String, enum: AppCategory, required: true },
    appType: { type: String, enum: AppType, default: null },
    appRole: { type: [String], enum: AppRole, default: null },
    scope: { type: [String], required: true },
    redirectAfter: { type: [String], default: null },
    reAuthenticateSession: { type: Boolean, default: false },
    reAuthenticate: { type: ReAuthenticate, default: null },
    expiresAt: { type: Date, default: () => new Date(Date.now() + TTLMinutes * 60 * 1000), index: { expires: 0 } },
    createdAt: Number,
    updatedAt: Number
})

OAuthSessionSchema.plugin(timestampPlugin)

export const OAuthSession: mongoose.Model<OAuthSessionResource> = (mongoose.models.OAuthSession as mongoose.Model<OAuthSessionResource>) ?? mongoose.model<OAuthSessionResource>("OAuthSession", OAuthSessionSchema, "oauth_session")