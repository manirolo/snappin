import { model, Model, models, Schema } from "mongoose"
import { timestampPlugin } from "../plugin/timestamps.plugin"
import { IntegrationStatus } from "@snappin/shared/integration/status.enum"
import { AppCategory, AppSlug } from "@snappin/shared/apps/app.enum"

export type IntegrationResource = {
    _id?: string
    // This integration belongs to this user
    // It can't be empty or null
    userId: string,

    // In which organization, this application integrated
    // It can be null
    orgId?: string | null,

    // Used to access the resource from the provider
    // accessToken comes with expiration. It can't used after it expired
    accessToken: string,

    // Access token expires 
    accessTokenExpiresAt?: Date | null,

    // refreshToken used to refresh the session token
    // This token never expires i think
    refreshToken: string,

    // Permission array
    scope: string[],

    // Various providers slug or name represents them
    // They are integration tool to extract invoices and export to accounting tools
    // It can't be null
    appSlug: AppSlug,

    // Types of providers i.e Email, Storage, etc
    appCategory: AppCategory,

    // Identifier for this integration
    // i.e. If email, email@company.com
    identifierEmail?: string

    // Whether the email account is monitored for new mails or not
    mailMonitored?: boolean

    mailHistoryId?: string | null

    mailWatchExpiresAt?: string | null

    // Status
    status: IntegrationStatus


    // Timestamps
    createdAt?: string,
    updatedAt?: string,
}

const IntegrationSchema = new Schema<IntegrationResource>({
    userId: { type: String, required: true },
    orgId: { type: String, default: null },
    accessToken: { type: String, required: true },
    accessTokenExpiresAt: { type: Date, default: null },
    refreshToken: { type: String, required: true },
    scope: { type: [String], default: [] },
    appSlug: { type: String, enum: AppSlug, required: true },
    appCategory: { type: String, enum: AppCategory, required: true },
    identifierEmail: { type: String, default: null },
    mailMonitored: { type: Boolean, default: false },
    mailHistoryId: { type: String, default: null },
    mailWatchExpiresAt: { type: String, default: null },
    status: { type: String, enum: IntegrationStatus, default: IntegrationStatus.ACTIVE },
    createdAt: Number,
    updatedAt: Number
})

IntegrationSchema.plugin(timestampPlugin)

export const Integration: Model<IntegrationResource> = (models.Integration as Model<IntegrationResource>) ?? model<IntegrationResource>("Integration", IntegrationSchema, "integration")