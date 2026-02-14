import z from "zod";
import { AppCategory, AppSlug, AppType, ZAppCategory, ZAppSlug } from "../apps/app.enum";
import { IntegrationStatus, ZIntegrationStatus } from "./status.enum";

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

    reAuthenticationRequired?: boolean | null

    // Permission array
    scope: string[],

    // Various providers slug or name represents them
    // They are integration tool to extract invoices and export to accounting tools
    // It can't be null
    appSlug: AppSlug,

    // Types of providers i.e Email, Storage, etc
    appCategory: AppCategory,

    appType?: AppType,

    // Identifier for this integration
    // i.e. If email, email@company.com
    identifierEmail?: string

    // Whether the email account is monitored for new mails or not
    mailMonitored?: boolean

    mailHistoryId?: number | null

    outlookSubscriptionId?: string | null

    mailWatchExpiresAt?: string | number | null

    locked: boolean
    lockedAt: Date | null

    // Status
    status: IntegrationStatus


    // Timestamps
    createdAt?: number,
    updatedAt?: number,
}

export const ZIntegration = z.custom<IntegrationResource>()