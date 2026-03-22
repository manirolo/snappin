import mongoose from "mongoose"
import { timestampPlugin } from "../plugin/timestamps.plugin"
import { IntegrationStatus } from "@snappin/shared/integration/status.enum"
import { AppCategory, AppRole, AppSlug, AppType, Provider } from "@snappin/shared/apps/app.schema"
import { IntegrationResource } from "@snappin/shared/integration/integration.schema"
import { fieldEncryption } from "mongoose-field-encryption"
import { env } from "@snappin/env"

const IntegrationSchema = new mongoose.Schema<IntegrationResource>({
    userId: { type: String, required: true },
    orgId: { type: String, default: null },

    accessToken: { type: String, default: null },
    accessTokenExpiresAt: { type: Date, default: null },

    refreshToken: { type: String, default: null },
    refreshTokenExpiresAt: { type: Date, default: null },

    reAuthenticationRequired: { type: Boolean, default: false },

    scope: { type: [String], default: [] },

    provider: { type: String, enum: Provider, default: null },
    appSlug: { type: String, enum: AppSlug, required: true },
    appCategory: { type: String, enum: AppCategory, required: true },
    appRole: { type: [String], enum: AppRole, required: true },
    appType: { type: String, enum: AppType, default: null },

    identifierEmail: { type: String, default: null },

    config: { type: mongoose.Schema.Types.Mixed, required: true },

    locked: { type: Boolean, default: false },
    lockedAt: { type: Number, default: null },

    status: { type: String, enum: IntegrationStatus, default: IntegrationStatus.CONNECTED },

    lastActivityAt: { type: Number, default: null },
    createdAt: Number,
    updatedAt: Number
})

IntegrationSchema.virtual("user", {
    ref: "User",
    localField: "userId",
    foreignField: "clerkUserId",
    justOne: true,
});

IntegrationSchema.plugin(fieldEncryption, {
    fields: ["accessToken", "refreshToken"],
    secret: env.encryption.secret,
    saltGenerator: (secret: string) => secret.slice(0, 16), // deterministic salt
});

IntegrationSchema.index({ orgId: 1, appSlug: 1 }, { unique: true })
IntegrationSchema.index({ identifierEmail: 1 })
IntegrationSchema.index({ status: 1 })
IntegrationSchema.index({ accessTokenExpiresAt: 1 })
IntegrationSchema.index(
    { orgId: 1, identifierEmail: 1, appSlug: 1 },
    { unique: true, sparse: true }
)


IntegrationSchema.set("toJSON", { virtuals: true })
IntegrationSchema.set("toObject", { virtuals: true })

IntegrationSchema.plugin(timestampPlugin)

export const Integration: mongoose.Model<IntegrationResource> = (mongoose.models.Integration as mongoose.Model<IntegrationResource>) ?? mongoose.model<IntegrationResource>("Integration", IntegrationSchema, "integration")