import mongoose from "mongoose"
import { timestampPlugin } from "../plugin/timestamps.plugin"
import { IntegrationStatus } from "@snappin/shared/integration/status.enum"
import { AppCategory, AppSlug, AppType } from "@snappin/shared/apps/app.enum"
import { IntegrationResource } from "@snappin/shared/integration/integration.schema"

const IntegrationSchema = new mongoose.Schema<IntegrationResource>({
    userId: { type: String, required: true },
    orgId: { type: String, default: null },

    accessToken: { type: String, required: true },
    accessTokenExpiresAt: { type: Date, default: null },

    refreshToken: { type: String, required: true },
    refreshTokenExpiresAt: { type: Date, default: null },

    reAuthenticationRequired: { type: Boolean, required: false },

    scope: { type: [String], default: [] },

    appSlug: { type: String, enum: AppSlug, required: true },
    appCategory: { type: String, enum: AppCategory, required: true },
    appType: { type: String, enum: AppType, default: null }, 

    identifierEmail: { type: String, default: null },

    config: { type: mongoose.Schema.Types.Mixed, required: true },

    locked: { type: Boolean, default: false },
    lockedAt: { type: Number, default: null },

    status: { type: String, enum: IntegrationStatus, default: IntegrationStatus.ACTIVE },
    
    createdAt: Number,
    updatedAt: Number
})

IntegrationSchema.plugin(timestampPlugin)

export const Integration: mongoose.Model<IntegrationResource> = (mongoose.models.Integration as mongoose.Model<IntegrationResource>) ?? mongoose.model<IntegrationResource>("Integration", IntegrationSchema, "integration")